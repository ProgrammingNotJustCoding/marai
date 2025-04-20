package controllers

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io"
	"marai/api/constants"
	"marai/internal/config"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gosimple/slug"
	echo "github.com/labstack/echo/v4"
	minio "github.com/minio/minio-go/v7"
)

type ConsultationController struct {
	consultationRepo *repositories.ConsultationRepo
	lawFirmRepo      *repositories.LawFirmRepo   // Needed for permission checks
	contractRepo     *repositories.ContractsRepo // Needed to update contracts
	minioClient      *minio.Client
	minioBucket      string
}

func NewConsultationController(consultationRepo *repositories.ConsultationRepo, lawFirmRepo *repositories.LawFirmRepo, contractRepo *repositories.ContractsRepo, minioClient *minio.Client) *ConsultationController {
	return &ConsultationController{
		consultationRepo: consultationRepo,
		lawFirmRepo:      lawFirmRepo,
		contractRepo:     contractRepo,
		minioClient:      minioClient,
		minioBucket:      config.GetEnv("MINIO_BUCKET_NAME"),
	}
}

// --- Request/Response Structs ---

type CreateConsultationRequest struct {
	LawFirmID   string `json:"lawFirmId" validate:"required"`
	CaseDetails string `json:"caseDetails" validate:"required"`
}

type AssignLawyerRequest struct {
	LawyerID string `json:"lawyerId" validate:"required"`
}

type UpdateFeesRequest struct {
	Fees schema.FeeMap `json:"fees" validate:"required"`
}

type SendMessageRequest struct {
	Message string `json:"message" validate:"required"`
}

// --- Consultation Handlers ---

// HandleCreateConsultation allows a user to submit a new consultation request.
func (cc *ConsultationController) HandleCreateConsultation(c echo.Context) error {
	userID := c.Get("userID").(string) // Assuming AuthMiddleware sets this
	req := new(CreateConsultationRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	// TODO: Add validation if needed (e.g., check if law firm exists)

	consultation, err := cc.consultationRepo.CreateConsultation(c.Request().Context(), userID, req.LawFirmID, req.CaseDetails)
	if err != nil {
		c.Logger().Error("Failed to create consultation:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Consultation submitted successfully.",
		PrettyMessage: "Your consultation request has been sent to the law firm.",
		Data:          consultation,
	})
}

// HandleListConsultations retrieves consultations based on user role and filters.
func (cc *ConsultationController) HandleListConsultations(c echo.Context) error {
	userID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType) // Assuming AuthMiddleware sets this

	page, _ := strconv.Atoi(c.QueryParam("page"))
	pageSize, _ := strconv.Atoi(c.QueryParam("pageSize"))
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 || pageSize > 100 { // Max page size 100
		pageSize = 20
	}

	filters := make(map[string]interface{})

	switch userType {
	case "user":
		filters["userID"] = userID
	case "lawfirm": // Law firm owner/admin
		// Check if user is owner/admin of the firm specified in query param (if any)
		lawFirmID := c.QueryParam("lawFirmId")
		if lawFirmID != "" {
			isOwner := cc.lawFirmRepo.IsOwner(userID, lawFirmID)
			isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, lawFirmID)
			if !isOwner && !isAdmin {
				return c.JSON(http.StatusForbidden, constants.ErrForbidden)
			}
			filters["lawFirmID"] = lawFirmID
		} else {
			// If no specific firm ID, list for all firms the user owns/administers (complex, maybe disallow?)
			// For now, let's assume they must provide a lawFirmId they manage.
			return c.JSON(http.StatusBadRequest, constants.Error{Status: 400, Message: "Bad Request", PrettyMessage: "Law firm ID is required for law firm users."})
		}
	case "lawyer": // Assigned lawyer
		filters["assignedLawyerID"] = userID // Assuming lawyer's user ID is used
	default:
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Optional filters from query params
	if status := c.QueryParam("status"); status != "" {
		filters["status"] = schema.ConsultationStatus(status)
	}
	if isTakenStr := c.QueryParam("isTaken"); isTakenStr != "" {
		if isTaken, err := strconv.ParseBool(isTakenStr); err == nil {
			filters["isTaken"] = isTaken
		}
	}

	consultations, total, err := cc.consultationRepo.ListConsultations(c.Request().Context(), filters, page, pageSize)
	if err != nil {
		c.Logger().Error("Failed to list consultations:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.PaginatedResponse{
		Status:        http.StatusOK,
		Message:       "Consultations retrieved successfully.",
		PrettyMessage: "Found consultations matching your criteria.",
		Data:          consultations,
		Total:         total,
		Page:          page,
		PageSize:      pageSize,
	})
}

// HandleGetConsultation retrieves a specific consultation by ID.
func (cc *ConsultationController) HandleGetConsultation(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		c.Logger().Error("Failed to get consultation:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// --- Authorization Check ---
	allowed := false
	switch userType {
	case "user":
		if consultation.UserID == userID {
			allowed = true
		}
	case "lawfirm":
		isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
		isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
		if isOwner || isAdmin {
			allowed = true
		}
	case "lawyer":
		if consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == userID {
			allowed = true
		}
	}

	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}
	// --- End Authorization Check ---

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Consultation retrieved successfully.",
		PrettyMessage: "Consultation details loaded.",
		Data:          consultation,
	})
}

// HandleAcceptConsultation allows a law firm admin/owner to accept a new consultation.
func (cc *ConsultationController) HandleAcceptConsultation(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only owner or admin of the law firm
	isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
	isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
	if !isOwner && !isAdmin {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	if consultation.Status != schema.StatusNew {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation is not in 'new' state."})
	}

	err = cc.consultationRepo.UpdateConsultationStatus(c.Request().Context(), consultationID, schema.StatusAcceptedByFirm)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Consultation accepted by firm.",
		PrettyMessage: "The consultation is now accepted and ready for lawyer assignment.",
	})
}

// HandleAssignLawyer allows a law firm admin/owner to assign a lawyer.
func (cc *ConsultationController) HandleAssignLawyer(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)
	req := new(AssignLawyerRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only owner or admin of the law firm
	isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
	isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
	if !isOwner && !isAdmin {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	if consultation.Status != schema.StatusAcceptedByFirm {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation must be accepted by the firm first."})
	}

	// TODO: Validate if the lawyerID is a valid member of the firm
	// member, err := cc.lawFirmRepo.GetMemberByID(c.Request().Context(), req.LawyerID)
	// if err != nil || member == nil || member.LawFirmID != consultation.LawFirmID { ... }

	err = cc.consultationRepo.AssignLawyer(c.Request().Context(), consultationID, req.LawyerID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Lawyer assigned successfully.",
		PrettyMessage: "The consultation has been assigned to the lawyer.",
	})
}

// HandleAcceptByLawyer allows the assigned lawyer to accept the consultation.
func (cc *ConsultationController) HandleAcceptByLawyer(c echo.Context) error {
	consultationID := c.Param("id")
	lawyerID := c.Get("userID").(string) // Lawyer's user ID

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only the assigned lawyer
	if consultation.AssignedLawyerID == nil || *consultation.AssignedLawyerID != lawyerID {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	if consultation.Status != schema.StatusAssigned {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation is not in 'assigned' state."})
	}

	err = cc.consultationRepo.UpdateConsultationStatus(c.Request().Context(), consultationID, schema.StatusAcceptedByLawyer)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Consultation accepted by lawyer.",
		PrettyMessage: "You have accepted the consultation. You can now chat with the user and set fees.",
	})
}

// HandleSetFees allows the assigned lawyer to set the fees.
func (cc *ConsultationController) HandleSetFees(c echo.Context) error {
	consultationID := c.Param("id")
	lawyerID := c.Get("userID").(string)
	req := new(UpdateFeesRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only the assigned lawyer
	if consultation.AssignedLawyerID == nil || *consultation.AssignedLawyerID != lawyerID {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Allow setting fees if accepted by lawyer or already confirmed (to update)
	if consultation.Status != schema.StatusAcceptedByLawyer && consultation.Status != schema.StatusConfirmed {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation must be accepted by the lawyer first."})
	}

	err = cc.consultationRepo.UpdateConsultationFees(c.Request().Context(), consultationID, req.Fees)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Fees set successfully.",
		PrettyMessage: "The proposed fees have been saved.",
		Data:          req.Fees,
	})
}

// HandleConfirmFees allows the user to confirm the fees set by the lawyer.
func (cc *ConsultationController) HandleConfirmFees(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only the user who submitted the consultation
	if consultation.UserID != userID {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Can only confirm if accepted by lawyer and fees are set
	if consultation.Status != schema.StatusAcceptedByLawyer || consultation.Fees == nil {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation must be accepted by lawyer and fees must be set."})
	}

	err = cc.consultationRepo.UpdateConsultationStatus(c.Request().Context(), consultationID, schema.StatusConfirmed)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Fees confirmed successfully.",
		PrettyMessage: "You have confirmed the fees. The consultation is now active.",
	})
}

// HandleMarkAsTaken allows the lawyer to mark the consultation as a case.
func (cc *ConsultationController) HandleMarkAsTaken(c echo.Context) error {
	consultationID := c.Param("id")
	lawyerID := c.Get("userID").(string)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: Only the assigned lawyer
	if consultation.AssignedLawyerID == nil || *consultation.AssignedLawyerID != lawyerID {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Can only mark as taken if fees are confirmed
	if consultation.Status != schema.StatusConfirmed {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Consultation fees must be confirmed by the user first."})
	}

	err = cc.consultationRepo.MarkAsTaken(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	// --- Optional: Update related Contract with Document Hashes ---
	// This assumes a contract might be created or linked based on this consultation becoming a case.
	// You might need a way to identify the relevant contract (e.g., passed in request, or find based on consultationID)
	/*
	   contractID := "some-contract-id" // Get this ID somehow
	   hashes, err := cc.consultationRepo.GetDocumentHashesForContract(c.Request().Context(), consultationID)
	   if err == nil && hashes != "" {
	       contract, err := cc.contractRepo.GetContractByID(c.Request().Context(), contractID)
	       if err == nil && contract != nil {
	           // Append hashes (ensure no duplicates if run multiple times)
	           // This simple append might lead to duplicates, needs better logic
	           if contract.DocumentHashes != "" {
	               contract.DocumentHashes += "," + hashes
	           } else {
	               contract.DocumentHashes = hashes
	           }
	           err = cc.contractRepo.UpdateContract(c.Request().Context(), contract)
	           if err != nil {
	               c.Logger().Warn("Failed to update contract with document hashes:", err)
	               // Don't fail the whole request, just log the warning
	           }
	       }
	   }
	*/
	// --- End Optional Contract Update ---

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Consultation marked as taken.",
		PrettyMessage: "This consultation is now considered an active case.",
	})
}

// --- Document Handlers ---

// HandleUploadDocument allows user or lawyer to upload a document to a consultation.
func (cc *ConsultationController) HandleUploadDocument(c echo.Context) error {
	consultationID := c.Param("id")
	uploaderID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization: User who submitted or the assigned lawyer
	allowed := false
	if consultation.UserID == uploaderID {
		allowed = true
	} else if consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == uploaderID && userType == "lawyer" {
		allowed = true
	}
	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	file, err := c.FormFile("document")
	if err != nil {
		return c.JSON(http.StatusBadRequest, constants.Error{Status: 400, Message: "Bad Request", PrettyMessage: "Missing 'document' file in form data."})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	defer src.Close()

	// Calculate hash while reading for upload
	hasher := sha256.New()
	teeReader := io.TeeReader(src, hasher)

	// Define object path in MinIO
	fileName := fmt.Sprintf("%s_%s%s", slug.Make(file.Filename), time.Now().Format("20060102150405"), filepath.Ext(file.Filename))
	objectPath := fmt.Sprintf("consultations/%s/documents/%s", consultationID, fileName)

	// Upload to MinIO
	_, err = cc.minioClient.PutObject(c.Request().Context(), cc.minioBucket, objectPath, teeReader, file.Size, minio.PutObjectOptions{ContentType: file.Header.Get("Content-Type")})
	if err != nil {
		c.Logger().Error("Failed to upload document to MinIO:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	fileHash := fmt.Sprintf("%x", hasher.Sum(nil))

	// Save document metadata to database
	doc := &schema.Document{
		ConsultationID: consultationID,
		Name:           file.Filename,
		FilePath:       objectPath,
		FileHash:       fileHash,
		UploadedByID:   uploaderID,
	}

	if err := cc.consultationRepo.AddDocument(c.Request().Context(), doc); err != nil {
		// Attempt to clean up MinIO object if DB save fails
		_ = cc.minioClient.RemoveObject(context.Background(), cc.minioBucket, objectPath, minio.RemoveObjectOptions{})
		c.Logger().Error("Failed to save document metadata:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Document uploaded successfully.",
		PrettyMessage: "The document has been added to the consultation.",
		Data:          doc,
	})
}

// HandleListDocuments retrieves all documents for a consultation.
func (cc *ConsultationController) HandleListDocuments(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID) // Use Get to ensure consultation exists
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization (same as GetConsultation)
	allowed := false
	switch userType {
	case "user":
		if consultation.UserID == userID {
			allowed = true
		}
	case "lawfirm":
		isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
		isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
		if isOwner || isAdmin {
			allowed = true
		}
	case "lawyer":
		if consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == userID {
			allowed = true
		}
	}
	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	documents, err := cc.consultationRepo.ListDocumentsByConsultation(c.Request().Context(), consultationID)
	if err != nil {
		c.Logger().Error("Failed to list documents:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Documents retrieved successfully.",
		PrettyMessage: "Found documents associated with this consultation.",
		Data:          documents,
	})
}

// HandleGetDocument retrieves a specific document's metadata (or download link).
func (cc *ConsultationController) HandleGetDocument(c echo.Context) error {
	consultationID := c.Param("id")
	docID := c.Param("docId")
	userID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)

	doc, err := cc.consultationRepo.GetDocumentByID(c.Request().Context(), docID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if doc == nil || doc.ConsultationID != consultationID {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID) // Need consultation for auth
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound) // Should not happen if doc was found, but check anyway
	}

	// Authorization (same as GetConsultation)
	allowed := false
	switch userType {
	case "user":
		if consultation.UserID == userID {
			allowed = true
		}
	case "lawfirm":
		isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
		isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
		if isOwner || isAdmin {
			allowed = true
		}
	case "lawyer":
		if consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == userID {
			allowed = true
		}
	}
	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Option 1: Return metadata
	// return c.JSON(http.StatusOK, constants.Response{ Data: doc })

	// Option 2: Generate presigned URL for download
	presignedURL, err := cc.minioClient.PresignedGetObject(c.Request().Context(), cc.minioBucket, doc.FilePath, time.Minute*15, nil)
	if err != nil {
		c.Logger().Error("Failed to generate presigned URL:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Document download URL generated.",
		PrettyMessage: "Use the URL to download the document.",
		Data:          map[string]string{"downloadUrl": presignedURL.String()},
	})
}

// --- Chat Handlers ---

// HandleSendMessage allows the user or assigned lawyer to send a message.
func (cc *ConsultationController) HandleSendMessage(c echo.Context) error {
	consultationID := c.Param("id")
	senderID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)
	req := new(SendMessageRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Determine receiver and check authorization
	var receiverID string
	allowed := false

	if userType == "user" && consultation.UserID == senderID {
		if consultation.AssignedLawyerID != nil {
			receiverID = *consultation.AssignedLawyerID
			allowed = true
		} else {
			// Cannot send message if no lawyer is assigned yet
			return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Cannot send message until a lawyer is assigned."})
		}
	} else if userType == "lawyer" && consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == senderID {
		receiverID = consultation.UserID
		allowed = true
	} else if userType == "lawfirm" { // Firm owner/admin cannot directly chat, only assigned lawyer
		allowed = false
	}

	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	// Ensure chat can only happen after lawyer accepts
	if consultation.Status != schema.StatusAcceptedByLawyer && consultation.Status != schema.StatusConfirmed && consultation.Status != schema.StatusTaken {
		return c.JSON(http.StatusConflict, constants.Error{Status: 409, Message: "Conflict", PrettyMessage: "Chat is only available after the lawyer accepts the consultation."})
	}

	msg := &schema.ChatMessage{
		ConsultationID: consultationID,
		SenderID:       senderID,
		ReceiverID:     receiverID,
		Message:        req.Message,
	}

	if err := cc.consultationRepo.AddChatMessage(c.Request().Context(), msg); err != nil {
		c.Logger().Error("Failed to send message:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	// TODO: Implement real-time notification (e.g., WebSockets, SSE)

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Message sent successfully.",
		PrettyMessage: "Your message has been delivered.",
		Data:          msg,
	})
}

// HandleListMessages retrieves chat messages for a consultation.
func (cc *ConsultationController) HandleListMessages(c echo.Context) error {
	consultationID := c.Param("id")
	userID := c.Get("userID").(string)
	userType := c.Get("userType").(schema.SessionType)

	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit <= 0 || limit > 200 { // Max 200 messages
		limit = 50
	}

	var afterTime *time.Time
	if afterTimestampStr := c.QueryParam("after"); afterTimestampStr != "" {
		if t, err := time.Parse(time.RFC3339Nano, afterTimestampStr); err == nil {
			afterTime = &t
		}
	}

	consultation, err := cc.consultationRepo.GetConsultationByID(c.Request().Context(), consultationID) // Need for auth
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if consultation == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	// Authorization (same as GetConsultation)
	allowed := false
	switch userType {
	case "user":
		if consultation.UserID == userID {
			allowed = true
		}
	case "lawfirm": // Allow admin/owner to view chat for oversight?
		isOwner := cc.lawFirmRepo.IsOwner(userID, consultation.LawFirmID)
		isAdmin, _ := cc.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, consultation.LawFirmID)
		if isOwner || isAdmin {
			allowed = true
		}
	case "lawyer":
		if consultation.AssignedLawyerID != nil && *consultation.AssignedLawyerID == userID {
			allowed = true
		}
	}
	if !allowed {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	messages, err := cc.consultationRepo.ListChatMessages(c.Request().Context(), consultationID, afterTime, limit)
	if err != nil {
		c.Logger().Error("Failed to list messages:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	// Mark messages as read for the current user
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = cc.consultationRepo.MarkMessagesAsRead(ctx, consultationID, userID)
	}()

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Messages retrieved successfully.",
		PrettyMessage: "Chat history loaded.",
		Data:          messages,
	})
}
