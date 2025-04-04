package schema

import (
	"time"
)

type User struct {
	ID               string `json:"id,omitempty" gorm:"primaryKey;type:varchar(26)"`
	Username         string `json:"username" gorm:"unique"`
	PasswordHash     string `json:"passwordHash,omitempty"`
	Email            string `json:"email,omitempty" gorm:"unique"`
	Mobile           string `json:"mobile,omitempty" gorm:"unique"`
	IsEmailVerified  bool   `json:"isEmailVerified,omitempty" gorm:"default:false"`
	IsMobileVerified bool   `json:"isMobileVerified,omitempty" gorm:"default:false"`
	IsDeleted        bool   `json:"isDeleted,omitempty" gorm:"default:false"`
	IsSuperAdmin     bool   `json:"isSuperAdmin,omitempty" gorm:"default:false"`

	LawFirmMemberships []LawFirmMembership `json:"lawFirmMemberships,omitempty" gorm:"foreignKey:UserID"`
	OwnedLawFirms      []LawFirm           `json:"ownedLawFirms,omitempty" gorm:"foreignKey:OwnerID"`

	LastLoginAt *time.Time `json:"lastLoginAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt,omitzero"`
	UpdatedAt   time.Time  `json:"updatedAt,omitzero"`
	DeletedAt   *time.Time `json:"deletedAt,omitempty"`
}

type UserPublicKey struct {
	ID      string    `json:"id" gorm:"primaryKey;type:varchar(26)"`
	UserID  string    `json:"userId" gorm:"type:varchar(26);index"`
	Key     string    `json:"key" gorm:"type:text"`
	Created time.Time `json:"created" gorm:"autoCreateTime"`
}

func (UserPublicKey) TableName() string {
	return "user_public_keys"
}
