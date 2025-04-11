package schema

import (
	"time"

	"gorm.io/gorm"
)

type SessionType string

type Session struct {
	gorm.Model
	ID          string      `json:"id" gorm:"primaryKey;type:varchar(26)"`
	UserID      string      `json:"userId" gorm:"type:varchar(26)"`
	SessionType SessionType `json:"sessionType" gorm:"type:varchar(26)"`
	ExpiresAt   time.Time   `json:"expiresAt"`
	CreatedAt   time.Time   `json:"createdAt"`
	UpdatedAt   time.Time   `json:"updatedAt"`
	IsRevoked   bool        `json:"isRevoked" gorm:"default:false"`
}
