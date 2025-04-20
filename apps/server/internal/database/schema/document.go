package schema

import (
	"time"
)

type Document struct {
	ID             string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ConsultationID string    `json:"consultationId" gorm:"index;not null"`
	Name           string    `json:"name" gorm:"not null"`
	FilePath       string    `json:"filePath" gorm:"not null"`
	FileHash       string    `json:"fileHash" gorm:"not null"`
	UploadedByID   string    `json:"uploadedById" gorm:"index;not null"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`

	Consultation Consultation `json:"-" gorm:"foreignKey:ConsultationID"`
	UploadedBy   User         `json:"uploadedBy,omitempty" gorm:"foreignKey:UploadedByID;references:ID"`
}
