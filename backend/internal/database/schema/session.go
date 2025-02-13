package schema

import (
	"time"

	"github.com/oklog/ulid/v2"
)

type Session struct {
	ID        ulid.ULID `json:"id" gorm:"primaryKey;type:varchar(26)"`
	UserID    ulid.ULID `json:"user_id" gorm:"type:varchar(26)"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsRevoked bool      `json:"is_revoked" gorm:"default:false"`
}
