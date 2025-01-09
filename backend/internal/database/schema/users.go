package schema

import "time"

type User struct {
	ID           int        `json:"id" gorm:"primaryKey"`
	Username     string     `json:"username"`
	PasswordHash string     `json:"password_hash"`
	Email        string     `json:"email" gorm:"unique"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at"`
	IsDeleted    bool       `json:"is_deleted"`
}
