package repositories

import (
	"context"
	"errors"
	"fmt"
	"marai/internal/database/schema"
	"time"

	"github.com/gosimple/slug"
	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type ConsultationRepo struct {
	db *gorm.DB
}

func NewConsultationRepository(db *gorm.DB) *ConsultationRepo {
	return &ConsultationRepo{db: db}
}

func (r *ConsultationRepo) CreateConsultation(ctx context.Context, userID, lawFirmID, caseDetails string) (*schema.Consultation, error) {
	consultation := &schema.Consultation{
		ID:          ulid.Make().String(),
		UserID:      userID,
		LawFirmID:   lawFirmID,
		CaseDetails: caseDetails,
		Status:      schema.StatusNew,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(consultation).Error; err != nil {
		return nil, err
	}
	return consultation, nil
}

func (r *ConsultationRepo) GetConsultationByID(ctx context.Context, id string) (*schema.Consultation, error) {
	var consultation schema.Consultation
	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("LawFirm").
		Preload("AssignedLawyer").
		Preload("Documents").
		Preload("ChatMessages", func(db *gorm.DB) *gorm.DB {
			return db.Order("timestamp asc")
		}).
		First(&consultation, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &consultation, nil
}

func (r *ConsultationRepo) ListConsultations(ctx context.Context, filters map[string]interface{}, page, pageSize int) ([]schema.Consultation, int64, error) {
	var consultations []schema.Consultation
	var total int64

	query := r.db.WithContext(ctx).Model(&schema.Consultation{}).Preload("User").Preload("LawFirm").Preload("AssignedLawyer")

	if userID, ok := filters["userID"].(string); ok && userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	if lawFirmID, ok := filters["lawFirmID"].(string); ok && lawFirmID != "" {
		query = query.Where("law_firm_id = ?", lawFirmID)
	}
	if assignedLawyerID, ok := filters["assignedLawyerID"].(string); ok && assignedLawyerID != "" {
		query = query.Where("assigned_lawyer_id = ?", assignedLawyerID)
	}
	if status, ok := filters["status"].(schema.ConsultationStatus); ok && status != "" {
		query = query.Where("status = ?", status)
	}
	if isTaken, ok := filters["isTaken"].(bool); ok {
		query = query.Where("is_taken = ?", isTaken)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if page > 0 && pageSize > 0 {
		offset := (page - 1) * pageSize
		query = query.Offset(offset).Limit(pageSize)
	}

	if err := query.Order("created_at desc").Find(&consultations).Error; err != nil {
		return nil, 0, err
	}

	return consultations, total, nil
}

func (r *ConsultationRepo) UpdateConsultationStatus(ctx context.Context, id string, status schema.ConsultationStatus) error {
	return r.db.WithContext(ctx).Model(&schema.Consultation{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":     status,
		"updated_at": time.Now(),
	}).Error
}

func (r *ConsultationRepo) AssignLawyer(ctx context.Context, id, lawyerID string) error {
	return r.db.WithContext(ctx).Model(&schema.Consultation{}).Where("id = ?", id).Updates(map[string]interface{}{
		"assigned_lawyer_id": lawyerID,
		"status":             schema.StatusAssigned,
		"updated_at":         time.Now(),
	}).Error
}

func (r *ConsultationRepo) UpdateConsultationFees(ctx context.Context, id string, fees schema.FeeMap) error {
	return r.db.WithContext(ctx).Model(&schema.Consultation{}).Where("id = ?", id).Updates(map[string]interface{}{
		"fees":       fees,
		"updated_at": time.Now(),
	}).Error
}

func (r *ConsultationRepo) MarkAsTaken(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Model(&schema.Consultation{}).Where("id = ?", id).Updates(map[string]interface{}{
		"is_taken":   true,
		"status":     schema.StatusTaken,
		"updated_at": time.Now(),
	}).Error
}

func (r *ConsultationRepo) AddDocument(ctx context.Context, doc *schema.Document) error {
	if doc.ID == "" {
		doc.ID = ulid.Make().String()
	}
	doc.CreatedAt = time.Now()
	doc.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Create(doc).Error
}

func (r *ConsultationRepo) GetDocumentByID(ctx context.Context, docID string) (*schema.Document, error) {
	var doc schema.Document
	err := r.db.WithContext(ctx).Preload("UploadedBy").First(&doc, "id = ?", docID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &doc, nil
}

func (r *ConsultationRepo) ListDocumentsByConsultation(ctx context.Context, consultationID string) ([]schema.Document, error) {
	var docs []schema.Document
	err := r.db.WithContext(ctx).
		Preload("UploadedBy").
		Where("consultation_id = ?", consultationID).
		Order("created_at desc").
		Find(&docs).Error
	return docs, err
}

func (r *ConsultationRepo) GetDocumentHashesForContract(ctx context.Context, consultationID string) (string, error) {
	var docs []schema.Document
	err := r.db.WithContext(ctx).
		Select("name, file_hash").
		Where("consultation_id = ?", consultationID).
		Find(&docs).Error
	if err != nil {
		return "", err
	}

	var hashes string
	for i, doc := range docs {
		slugifiedName := slug.Make(doc.Name)
		hashes += fmt.Sprintf("%s_%s", slugifiedName, doc.FileHash)
		if i < len(docs)-1 {
			hashes += ","
		}
	}
	return hashes, nil
}

func (r *ConsultationRepo) AddChatMessage(ctx context.Context, msg *schema.ChatMessage) error {
	if msg.ID == "" {
		msg.ID = ulid.Make().String()
	}
	msg.Timestamp = time.Now()
	return r.db.WithContext(ctx).Create(msg).Error
}

func (r *ConsultationRepo) ListChatMessages(ctx context.Context, consultationID string, after *time.Time, limit int) ([]schema.ChatMessage, error) {
	var messages []schema.ChatMessage
	query := r.db.WithContext(ctx).
		Preload("Sender").
		Where("consultation_id = ?", consultationID)

	if after != nil {
		query = query.Where("timestamp > ?", *after)
	}

	query = query.Order("timestamp asc")

	if limit > 0 {
		query = query.Limit(limit)
	}

	err := query.Find(&messages).Error
	return messages, err
}

func (r *ConsultationRepo) MarkMessagesAsRead(ctx context.Context, consultationID, receiverID string) error {
	return r.db.WithContext(ctx).
		Model(&schema.ChatMessage{}).
		Where("consultation_id = ? AND receiver_id = ? AND is_read = ?", consultationID, receiverID, false).
		Update("is_read", true).Error
}
