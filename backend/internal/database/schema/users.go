package schema

import (
	"time"
)

type User struct {
	ID               string     `json:"id" gorm:"primaryKey;type:varchar(26)"`
	Username         string     `json:"username"`
	PasswordHash     string     `json:"passwordHash,omitempty"`
	Email            string     `json:"email" gorm:"unique"`
	IsEmailVerified  bool       `json:"isEmailVerified" gorm:"default:false"`
	Mobile           string     `json:"mobile" gorm:"unique"`
	IsMobileVerified bool       `json:"isMobileVerified" gorm:"default:false"`
	LastLoginAt      *time.Time `json:"lastLoginAt"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt"`
	IsDeleted bool       `json:"isDeleted" gorm:"default:false"`

	LawFirmMemberships []LawFirmMembership `gorm:"foreignKey:UserID"`
	OwnedLawFirms      []LawFirm           `gorm:"foreignKey:OwnerID"`
}
