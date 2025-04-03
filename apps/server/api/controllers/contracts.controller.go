package controllers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"marai/api/constants"
	"marai/internal/config"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"marai/internal/utils"
	"net/http"
	"strconv"
	"strings"
	"time"

	echo "github.com/labstack/echo/v4"
)

const (
	StatusDraft            = "draft"
	StatusPendingSignature = "pending_signature"
	StatusVoid             = "void"
)

type CreateContractRequest struct {
	Title       string     `json:"title" validate:"required"`
	Description string     `json:"description"`
	Content     string     `json:"content"`
	LawFirmID   string     `json:"lawFirmId" validate:"required"`
	IsTemplate  bool       `json:"isTemplate"`
	ExpiresAt   *time.Time `json:"expiresAt"`
}

type UpdateContractRequest struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Content     string     `json:"content"`
	Status      string     `json:"status"`
	ExpiresAt   *time.Time `json:"expiresAt"`
}

type AddPartyRequest struct {
	UserID string `json:"userId"`
	Name   string `json:"name" validate:"required"`
	Email  string `json:"email"`
	Mobile string `json:"mobile"`
	Role   string `json:"role"`
}

type SignContractRequest struct {
	Signature string `json:"signature" validate:"required"`
}

type ContractsController struct {
	contracts   *repositories.ContractsRepo
	lawFirmRepo *repositories.LawFirmRepo
}

func NewContractsController(contractsRepo *repositories.ContractsRepo, lawFirmRepo *repositories.LawFirmRepo) *ContractsController {
	return &ContractsController{
		contracts:   contractsRepo,
		lawFirmRepo: lawFirmRepo,
	}
}

func (cc *ContractsController) HandleCreateContract(c echo.Context) error {
	req := new(CreateContractRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	userID := c.Get("userID").(string)

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, req.LawFirmID, "write")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, req.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	contract := &schema.Contract{
		Title:       req.Title,
		Description: req.Description,
		Content:     req.Content,
		LawFirmID:   req.LawFirmID,
		CreatorID:   userID,
		IsTemplate:  req.IsTemplate,
		Status:      StatusDraft,
		ExpiresAt:   req.ExpiresAt,
	}

	if err := cc.contracts.CreateContract(c.Request().Context(), contract); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Contract created successfully",
		PrettyMessage: "The contract has been created successfully",
		Data:          contract,
	})
}

func (cc *ContractsController) HandleGetContract(c echo.Context) error {
	contractID := c.Param("id")
	userID := c.Get("userID").(string)

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "read")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isParty := false
	for _, party := range contract.Parties {
		if party.UserID == userID {
			isParty = true
			break
		}
	}

	if !hasPermission && !isOwner && !isParty {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Contract retrieved successfully",
		Data:    contract,
	})
}

func (cc *ContractsController) HandleListContracts(c echo.Context) error {
	lawFirmID := c.Param("lawFirmId")
	userID := c.Get("userID").(string)

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, lawFirmID, "read")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	params := make(map[string]interface{})

	if status := c.QueryParam("status"); status != "" {
		params["status"] = status
	}

	if isTemplate := c.QueryParam("isTemplate"); isTemplate == "true" {
		params["isTemplate"] = true
	} else if isTemplate == "false" {
		params["isTemplate"] = false
	}

	if limit := c.QueryParam("limit"); limit != "" {
		if limitInt, err := strconv.Atoi(limit); err == nil {
			params["limit"] = limitInt
		}
	}

	if offset := c.QueryParam("offset"); offset != "" {
		if offsetInt, err := strconv.Atoi(offset); err == nil {
			params["offset"] = offsetInt
		}
	}

	if orderBy := c.QueryParam("orderBy"); orderBy != "" {
		params["orderBy"] = orderBy
	}

	if sortDir := c.QueryParam("sortDirection"); sortDir != "" {
		params["sortDirection"] = sortDir
	}

	contracts, err := cc.contracts.GetContractsByLawFirmID(c.Request().Context(), lawFirmID, params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Contracts retrieved successfully",
		Data:    contracts,
	})
}

func (cc *ContractsController) HandleUpdateContract(c echo.Context) error {
	contractID := c.Param("id")
	req := new(UpdateContractRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	userID := c.Get("userID").(string)

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "write")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	if req.Status != "" {
		validStatusTransition := false

		switch contract.Status {
		case StatusDraft:
			validStatusTransition = req.Status == StatusPendingSignature || req.Status == StatusVoid
		case StatusPendingSignature:
			validStatusTransition = req.Status == StatusVoid
		case "signed":
			validStatusTransition = req.Status == StatusVoid
		}

		if !validStatusTransition {
			return c.JSON(http.StatusBadRequest, constants.Error{
				Status:        http.StatusBadRequest,
				Message:       "Invalid Status Transition",
				PrettyMessage: "The requested status change is not valid for this contract's current state",
			})
		}
	}

	if req.Title != "" {
		contract.Title = req.Title
	}

	if req.Description != "" {
		contract.Description = req.Description
	}

	if req.Content != "" {
		contract.Content = req.Content
	}

	if req.Status != "" {
		contract.Status = req.Status
	}

	if req.ExpiresAt != nil {
		contract.ExpiresAt = req.ExpiresAt
	}

	if err := cc.contracts.UpdateContract(c.Request().Context(), contract); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Contract updated successfully",
		Data:    contract,
	})
}

func (cc *ContractsController) HandleDeleteContract(c echo.Context) error {
	contractID := c.Param("id")
	userID := c.Get("userID").(string)

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	hasManagePermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "manage")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasManagePermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	if contract.Status != StatusDraft && contract.Status != StatusVoid {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Cannot Delete Active Contract",
			PrettyMessage: "Only draft or void contracts can be deleted",
		})
	}

	if err := cc.contracts.SoftDeleteContract(c.Request().Context(), contractID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Contract deleted successfully",
	})
}

func (cc *ContractsController) HandleUploadContractFile(c echo.Context) error {
	contractID := c.Param("id")
	userID := c.Get("userID").(string)
	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}
	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "write")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Invalid File",
			PrettyMessage: "No file was uploaded or the file is invalid",
		})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	defer func() {
		if closeErr := src.Close(); closeErr != nil {
			c.Logger().Errorf("failed to close file: %v", closeErr)
		}
	}()

	fileContent, err := io.ReadAll(src)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	encryptionKey, err := cc.getContractEncryptionKey(contractID)
	if err != nil {
		c.Logger().Error("Error getting encryption key: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Encryption Failed",
			PrettyMessage: "There was an error preparing encryption",
		})
	}

	encryptedContent, err := utils.EncryptData(fileContent, encryptionKey)
	if err != nil {
		c.Logger().Error("Error encrypting file: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Encryption Failed",
			PrettyMessage: "There was an error encrypting the file",
		})
	}

	fileURL, fileHash, err := cc.contracts.UploadEncryptedContractFile(c.Request().Context(), string(encryptedContent), contractID, file.Filename)
	if err != nil {
		c.Logger().Error("Error uploading file: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "File Upload Failed",
			PrettyMessage: "There was an error uploading your file",
		})
	}

	contract.FileURL = fileURL
	contract.FilePath = fmt.Sprintf("contracts/%s/%s", contractID, file.Filename)
	contract.FileHash = fileHash

	for i := range contract.Parties {
		contract.Parties[i].HasSigned = false
		contract.Parties[i].SignedAt = nil
	}
	contract.Status = StatusDraft
	// TODO: Notify parties about the new file uploaded

	if err := cc.contracts.UpdateContract(c.Request().Context(), contract); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "File uploaded successfully",
		PrettyMessage: "The contract file has been uploaded successfully",
		Data: map[string]string{
			"fileUrl":  fileURL,
			"fileHash": fileHash,
		},
	})
}

func (cc *ContractsController) HandleGetContractFile(c echo.Context) error {
	contractID := c.Param("id")
	userID := c.Get("userID").(string)
	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}
	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "read")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	isParty := false
	for _, party := range contract.Parties {
		if party.UserID == userID {
			isParty = true
			break
		}
	}
	if !hasPermission && !isOwner && !isParty {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	fileName := c.Param("fileName")
	if fileName == "" {
		parts := strings.Split(contract.FilePath, "/")
		if len(parts) > 0 {
			fileName = parts[len(parts)-1]
		} else {
			return c.JSON(http.StatusBadRequest, constants.Error{
				Status:        http.StatusBadRequest,
				Message:       "Invalid File",
				PrettyMessage: "The requested file is invalid",
			})
		}
	}

	encryptedContent, err := cc.contracts.GetEncryptedContractFile(c.Request().Context(), contractID, fileName)
	if err != nil {
		c.Logger().Error("Error retrieving file: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "File Retrieval Failed",
			PrettyMessage: "There was an error retrieving the file",
		})
	}

	encryptionKey, err := cc.getContractEncryptionKey(contractID)
	if err != nil {
		c.Logger().Error("Error getting encryption key: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Decryption Failed",
			PrettyMessage: "There was an error preparing decryption",
		})
	}

	decryptedContent, err := utils.DecryptData(encryptedContent, encryptionKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Decryption Failed",
			PrettyMessage: "There was an error decrypting the file",
		})
	}

	c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.Response().Header().Set("Content-Type", "application/octet-stream")
	c.Response().Header().Set("Content-Length", fmt.Sprintf("%d", len(decryptedContent)))
	c.Response().WriteHeader(http.StatusOK)
	_, err = c.Response().Write(decryptedContent)
	return err
}

func (cc *ContractsController) HandleAddContractParty(c echo.Context) error {
	contractID := c.Param("id")
	req := new(AddPartyRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	userID := c.Get("userID").(string)

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "write")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	if contract.Status != StatusDraft {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Cannot Modify Contract",
			PrettyMessage: "Parties can only be added to draft contracts",
		})
	}

	party := &schema.ContractParty{
		ContractID: contractID,
		UserID:     req.UserID,
		Name:       req.Name,
		Email:      req.Email,
		Mobile:     req.Mobile,
		Role:       req.Role,
		HasSigned:  false,
	}

	if err := cc.contracts.AddContractParty(c.Request().Context(), party); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Party added successfully",
		PrettyMessage: "The party has been added to the contract",
		Data:          party,
	})
}

func (cc *ContractsController) HandleRemoveContractParty(c echo.Context) error {
	contractID := c.Param("id")
	partyID := c.Param("partyId")
	userID := c.Get("userID").(string)

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	hasPermission, err := cc.lawFirmRepo.HasPermission(c.Request().Context(), userID, contract.LawFirmID, "write")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	isOwner, err := cc.lawFirmRepo.IsOwner(c.Request().Context(), userID, contract.LawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !hasPermission && !isOwner {
		return c.JSON(http.StatusForbidden, constants.ErrNoPermission)
	}

	if contract.Status != StatusDraft {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Cannot Modify Contract",
			PrettyMessage: "Parties can only be removed from draft contracts",
		})
	}

	var foundParty *schema.ContractParty
	for _, party := range contract.Parties {
		if party.ID == partyID {
			foundParty = &party
			break
		}
	}

	if foundParty == nil {
		return c.JSON(http.StatusNotFound, constants.Error{
			Status:        http.StatusNotFound,
			Message:       "Party Not Found",
			PrettyMessage: "The specified party does not exist in this contract",
		})
	}

	if err := cc.contracts.DeleteContractParty(c.Request().Context(), partyID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Party removed successfully",
		PrettyMessage: "The party has been removed from the contract",
	})
}

func (cc *ContractsController) HandleSignContract(c echo.Context) error {
	contractID := c.Param("id")
	userID := c.Get("userID").(string)
	req := new(SignContractRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	contract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if contract == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if contract.Status != StatusPendingSignature {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Invalid Contract Status",
			PrettyMessage: "The contract is not ready for signatures",
		})
	}

	var foundParty *schema.ContractParty
	for _, party := range contract.Parties {
		if party.UserID == userID {
			foundParty = &party
			break
		}
	}

	if foundParty == nil {
		return c.JSON(http.StatusForbidden, constants.Error{
			Status:        http.StatusForbidden,
			Message:       "Not Authorized to Sign",
			PrettyMessage: "You are not authorized to sign this contract",
		})
	}

	if foundParty.HasSigned {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Already Signed",
			PrettyMessage: "You have already signed this contract",
		})
	}

	if err := cc.contracts.SignContract(
		c.Request().Context(),
		contractID,
		foundParty.ID,
		userID,
		req.Signature,
		c.RealIP(),
		c.Request().UserAgent(),
	); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	updatedContract, err := cc.contracts.GetContractByID(c.Request().Context(), contractID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Contract signed successfully",
		PrettyMessage: "You have successfully signed the contract",
		Data:          updatedContract,
	})
}

func (cc *ContractsController) getContractEncryptionKey(contractID string) (string, error) {
	masterKey := config.GetEnv("ENCRYPTION_MASTER_KEY")
	if masterKey == "" {
		return "", fmt.Errorf("master encryption key not configured")
	}

	h := hmac.New(sha256.New, []byte(masterKey))
	h.Write([]byte(contractID))
	derivedKey := hex.EncodeToString(h.Sum(nil))

	return derivedKey, nil
}
