package schema

import (
	"time"
)

type Contract struct {
	ID             string     `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Title          string     `json:"title" gorm:"not null"`
	Description    string     `json:"description"`
	Content        string     `json:"content,omitempty" gorm:"type:text"`
	FileURL        string     `json:"fileUrl,omitempty"`
	FilePath       string     `json:"filePath,omitempty"`
	FileHash       string     `json:"fileHash,omitempty"`
	SignatureHash  string     `json:"signatureHash,omitempty"`
	Status         string     `json:"status" gorm:"not null;default:'draft'"`
	LawFirmID      string     `json:"lawFirmId" gorm:"index;not null"`
	CreatorID      string     `json:"creatorId" gorm:"index;not null"`
	IsTemplate     bool       `json:"isTemplate" gorm:"default:false"`
	ExpiresAt      *time.Time `json:"expiresAt,omitempty"`
	IsDeleted      bool       `json:"isDeleted" gorm:"default:false"`
	DocumentHashes string     `json:"documentHashes,omitempty" gorm:"type:text"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	DeletedAt      *time.Time `json:"deletedAt,omitempty"`

	// LawFirm         LawFirm          `json:"-" gorm:"foreignKey:LawFirmID"`
	// Creator         User             `json:"-" gorm:"foreignKey:CreatorID"`
	Parties         []ContractParty  `json:"parties,omitempty" gorm:"foreignKey:ContractID"`
	SignatureEvents []SignatureEvent `json:"signatureEvents,omitempty" gorm:"foreignKey:ContractID"`
}

type ContractParty struct {
	ID          string     `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ContractID  string     `json:"contractId" gorm:"index;not null"`
	UserID      string     `json:"userId,omitempty" gorm:"index"`
	Name        string     `json:"name" gorm:"not null"`
	Email       string     `json:"email"`
	Mobile      string     `json:"mobile"`
	Role        string     `json:"role"`
	HasSigned   bool       `json:"hasSigned" gorm:"default:false"`
	HasVerified bool       `json:"hasVerified" gorm:"default:false"`
	SignedAt    *time.Time `json:"signedAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`

	User     User     `json:"-" gorm:"foreignKey:UserID"`
	Contract Contract `json:"-" gorm:"foreignKey:ContractID"`
}

type SignatureEvent struct {
	ID         string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	ContractID string    `json:"contractId" gorm:"index;not null"`
	UserID     string    `json:"userId" gorm:"index;not null"`
	PartyID    string    `json:"partyId" gorm:"index;not null"`
	Action     string    `json:"action" gorm:"not null"`
	Signature  string    `json:"signature,omitempty"`
	IPAddress  string    `json:"ipAddress,omitempty"`
	UserAgent  string    `json:"userAgent,omitempty"`
	Timestamp  time.Time `json:"timestamp" gorm:"not null"`

	User     User          `json:"-" gorm:"foreignKey:UserID"`
	Contract Contract      `json:"-" gorm:"foreignKey:ContractID"`
	Party    ContractParty `json:"-" gorm:"foreignKey:PartyID"`
}
