package schema

import (
	"time"
)

type Document struct {
	ID             string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ConsultationID string    `json:"consultationId" gorm:"index;not null"`
	Name           string    `json:"name" gorm:"not null"`
	FilePath       string    `json:"filePath" gorm:"not null"`           // Path in MinIO/S3
	FileHash       string    `json:"fileHash" gorm:"not null"`           // SHA256 hash of the file content
	UploadedByID   string    `json:"uploadedById" gorm:"index;not null"` // User or Lawyer ID
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`

	Consultation Consultation `json:"-" gorm:"foreignKey:ConsultationID"`
	UploadedBy   User         `json:"uploadedBy,omitempty" gorm:"foreignKey:UploadedByID;references:ID"` // Assuming User schema holds both users and lawyers for simplicity, adjust if needed
}
