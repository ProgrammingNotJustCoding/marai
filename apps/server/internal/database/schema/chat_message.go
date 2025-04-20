package schema

import (
	"time"
)

type ChatMessage struct {
	ID             string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ConsultationID string    `json:"consultationId" gorm:"index;not null"`
	SenderID       string    `json:"senderId" gorm:"index;not null"`   // User or Lawyer ID
	ReceiverID     string    `json:"receiverId" gorm:"index;not null"` // User or Lawyer ID
	Message        string    `json:"message" gorm:"type:text;not null"`
	Timestamp      time.Time `json:"timestamp" gorm:"index"`
	IsRead         bool      `json:"isRead" gorm:"default:false"`

	Consultation Consultation `json:"-" gorm:"foreignKey:ConsultationID"`
	Sender       User         `json:"sender,omitempty" gorm:"foreignKey:SenderID;references:ID"`     // Assuming User schema holds both users and lawyers
	Receiver     User         `json:"receiver,omitempty" gorm:"foreignKey:ReceiverID;references:ID"` // Assuming User schema holds both users and lawyers
}
