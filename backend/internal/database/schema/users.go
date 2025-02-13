package schema

import (
	"time"

	"github.com/oklog/ulid/v2"
)

type User struct {
	ID               ulid.ULID  `json:"id" gorm:"primaryKey;type:varchar(26)"`
	Username         string     `json:"username"`
	PasswordHash     string     `json:"password_hash,omitempty"`
	Email            string     `json:"email" gorm:"unique"`
	IsEmailVerified  bool       `json:"is_email_verified" gorm:"default:false"`
	Mobile           string     `json:"mobile" gorm:"unique"`
	IsMobileVerified bool       `json:"is_mobile_verified" gorm:"default:false"`
	LastLoginAt      *time.Time `json:"last_login_at"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
	DeletedAt        *time.Time `json:"deleted_at"`
	IsDeleted        bool       `json:"is_deleted" gorm:"default:false"`
}
