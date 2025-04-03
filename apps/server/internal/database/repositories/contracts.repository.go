package repositories

import (
	"bytes"
	"context"
	"crypto/sha256"
	"errors"
	"fmt"
	"io"
	"marai/internal/database/schema"
	"mime/multipart"
	"time"

	minio "github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/encrypt"
	ulid "github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type ContractsRepo struct {
	db          *gorm.DB
	minioClient *minio.Client
	bucketName  string
}

func NewContractsRepository(db *gorm.DB, minioClient *minio.Client) *ContractsRepo {
	return &ContractsRepo{
		db:          db,
		minioClient: minioClient,
		bucketName:  "contracts",
	}
}

func (r *ContractsRepo) CreateContract(ctx context.Context, contract *schema.Contract) error {
	contract.ID = ulid.Make().String()
	contract.CreatedAt = time.Now()
	contract.UpdatedAt = time.Now()

	if contract.Status == "" {
		contract.Status = "draft"
	}

	return r.db.WithContext(ctx).Create(contract).Error
}

func (r *ContractsRepo) GetContractByID(ctx context.Context, id string) (*schema.Contract, error) {
	var contract schema.Contract

	result := r.db.WithContext(ctx).
		Preload("Parties.User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
		Preload("SignatureEvents").
		Where("id = ? AND is_deleted = ?", id, false).
		First(&contract)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &contract, nil
}

func (r *ContractsRepo) GetContractsByLawFirmID(ctx context.Context, lawFirmID string, params map[string]any) ([]schema.Contract, error) {
	var contracts []schema.Contract

	query := r.db.WithContext(ctx).
		Where("law_firm_id = ? AND is_deleted = ?", lawFirmID, false)

	if status, ok := params["status"].(string); ok && status != "" {
		query = query.Where("status = ?", status)
	}

	if isTemplate, ok := params["isTemplate"].(bool); ok {
		query = query.Where("is_template = ?", isTemplate)
	}

	if orderBy, ok := params["orderBy"].(string); ok && orderBy != "" {
		direction := "DESC"
		if sortDir, ok := params["sortDirection"].(string); ok && sortDir == "asc" {
			direction = "ASC"
		}
		query = query.Order(fmt.Sprintf("%s %s", orderBy, direction))
	} else {
		query = query.Order("created_at DESC")
	}

	if limit, ok := params["limit"].(int); ok && limit > 0 {
		query = query.Limit(limit)

		if offset, ok := params["offset"].(int); ok && offset >= 0 {
			query = query.Offset(offset)
		}
	}

	err := query.Find(&contracts).Error
	return contracts, err
}

func (r *ContractsRepo) UpdateContract(ctx context.Context, contract *schema.Contract) error {
	contract.UpdatedAt = time.Now()

	result := r.db.WithContext(ctx).Model(contract).Updates(map[string]any{
		"title":       contract.Title,
		"description": contract.Description,
		"content":     contract.Content,
		"file_url":    contract.FileURL,
		"file_path":   contract.FilePath,
		"status":      contract.Status,
		"expires_at":  contract.ExpiresAt,
		"updated_at":  contract.UpdatedAt,
	})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("contract not found")
	}

	return nil
}

func (r *ContractsRepo) SoftDeleteContract(ctx context.Context, id string) error {
	now := time.Now()

	result := r.db.WithContext(ctx).Model(&schema.Contract{}).
		Where("id = ? AND is_deleted = ?", id, false).
		Updates(map[string]any{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("contract not found")
	}

	return nil
}

func (r *ContractsRepo) UploadContractFile(ctx context.Context, file *multipart.FileHeader, contractID string) (string, string, error) {
	objectName := fmt.Sprintf("contracts/%s/%s", contractID, file.Filename)

	src, err := file.Open()
	if err != nil {
		return "", "", err
	}
	defer func() {
		if closeErr := src.Close(); closeErr != nil {
			fmt.Printf("failed to close file: %v", closeErr)
		}
	}()

	hasher := sha256.New()
	if _, err := io.Copy(hasher, src); err != nil {
		return "", "", err
	}
	fileHash := fmt.Sprintf("%x", hasher.Sum(nil))

	if _, err := src.Seek(0, 0); err != nil {
		return "", "", err
	}

	_, err = r.minioClient.PutObject(ctx, r.bucketName, objectName, src, file.Size, minio.PutObjectOptions{
		ContentType:          file.Header.Get("Content-Type"),
		ServerSideEncryption: encrypt.NewSSE(),
	})
	if err != nil {
		return "", "", err
	}

	fileURL := fmt.Sprintf("/api/contracts/%s/file", contractID)

	return fileURL, fileHash, nil
}

func (r *ContractsRepo) GetContractFile(ctx context.Context, contractID, fileName string) (*minio.Object, error) {
	objectName := fmt.Sprintf("contracts/%s/%s", contractID, fileName)

	object, err := r.minioClient.GetObject(ctx, r.bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := object.Close(); closeErr != nil {
			fmt.Printf("failed to close object: %v", closeErr)
		}
	}()

	return object, nil
}

func (r *ContractsRepo) UploadEncryptedContractFile(ctx context.Context, encryptedContent string, contractID string, fileName string) (string, string, error) {
	objectName := fmt.Sprintf("contracts/%s/%s", contractID, fileName)
	contentBytes := []byte(encryptedContent)
	hasher := sha256.New()
	hasher.Write(contentBytes)
	fileHash := fmt.Sprintf("%x", hasher.Sum(nil))

	_, err := r.minioClient.PutObject(ctx, r.bucketName, objectName,
		bytes.NewReader(contentBytes), int64(len(contentBytes)), minio.PutObjectOptions{
			ContentType: "application/octet-stream",
		})
	if err != nil {
		return "", "", err
	}

	fileURL := fmt.Sprintf("/api/contracts/%s/file", contractID)
	return fileURL, fileHash, nil
}

func (r *ContractsRepo) GetEncryptedContractFile(ctx context.Context, contractID string, fileName string) ([]byte, error) {
	objectName := fmt.Sprintf("contracts/%s/%s", contractID, fileName)
	object, err := r.minioClient.GetObject(ctx, r.bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	defer func() {
		if closeErr := object.Close(); closeErr != nil {
			fmt.Printf("failed to close object: %v", closeErr)
		}
	}()

	contentBytes, err := io.ReadAll(object)
	if err != nil {
		return nil, err
	}

	return contentBytes, nil
}

func (r *ContractsRepo) AddContractParty(ctx context.Context, party *schema.ContractParty) error {
	party.ID = ulid.Make().String()
	party.CreatedAt = time.Now()

	return r.db.WithContext(ctx).Create(party).Error
}

func (r *ContractsRepo) UpdateContractParty(ctx context.Context, party *schema.ContractParty) error {
	result := r.db.WithContext(ctx).Model(party).Updates(map[string]any{
		"name":       party.Name,
		"email":      party.Email,
		"mobile":     party.Mobile,
		"role":       party.Role,
		"has_signed": party.HasSigned,
		"signed_at":  party.SignedAt,
	})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("contract party not found")
	}

	return nil
}

func (r *ContractsRepo) DeleteContractParty(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&schema.ContractParty{}, "id = ?", id).Error
}

func (r *ContractsRepo) RecordSignatureEvent(ctx context.Context, event *schema.SignatureEvent) error {
	event.ID = ulid.Make().String()
	event.Timestamp = time.Now()

	return r.db.WithContext(ctx).Create(event).Error
}

func (r *ContractsRepo) GetContractParties(ctx context.Context, contractID string) ([]schema.ContractParty, error) {
	var parties []schema.ContractParty

	err := r.db.WithContext(ctx).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
		Where("contract_id = ?", contractID).
		Find(&parties).Error

	return parties, err
}

func (r *ContractsRepo) SignContract(ctx context.Context, contractID, partyID, userID, signature, ipAddress, userAgent string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&schema.ContractParty{}).
			Where("id = ? AND contract_id = ?", partyID, contractID).
			Updates(map[string]any{
				"has_signed": true,
				"signed_at":  time.Now(),
			}).Error; err != nil {
			return err
		}

		event := &schema.SignatureEvent{
			ID:         ulid.Make().String(),
			ContractID: contractID,
			UserID:     userID,
			PartyID:    partyID,
			Action:     "signed",
			Signature:  signature,
			IPAddress:  ipAddress,
			UserAgent:  userAgent,
			Timestamp:  time.Now(),
		}

		if err := tx.Create(event).Error; err != nil {
			return err
		}

		var unsignedCount int64
		if err := tx.Model(&schema.ContractParty{}).
			Where("contract_id = ? AND has_signed = ?", contractID, false).
			Count(&unsignedCount).Error; err != nil {
			return err
		}

		if unsignedCount == 0 {
			if err := tx.Model(&schema.Contract{}).
				Where("id = ?", contractID).
				Update("status", "signed").Error; err != nil {
				return err
			}
		}

		return nil
	})
}
