package schema

import (
	"time"
)

type ChatMessage struct {
	ID             string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ConsultationID string    `json:"consultationId" gorm:"index;not null"`
	SenderID       string    `json:"senderId" gorm:"index;not null"`
	ReceiverID     string    `json:"receiverId" gorm:"index;not null"`
	SenderType     string    `json:"senderType" gorm:"type:varchar(20);not null;default:'user'"`   // 'user' or 'lawyer'
	ReceiverType   string    `json:"receiverType" gorm:"type:varchar(20);not null;default:'user'"` // 'user' or 'lawyer'
	Message        string    `json:"message" gorm:"type:text;not null"`
	Timestamp      time.Time `json:"timestamp" gorm:"index"`
	IsRead         bool      `json:"isRead" gorm:"default:false"`

	Consultation Consultation `json:"-" gorm:"foreignKey:ConsultationID"`
}
