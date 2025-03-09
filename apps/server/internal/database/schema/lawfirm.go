package schema

import "time"

type LawFirm struct {
	ID      string `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Name    string `json:"name" gorm:"unique;not null"`
	Address string `json:"address,omitempty"`
	Phone   string `json:"phone,omitempty"`
	Email   string `json:"email" gorm:"unique;not null"`
	OwnerID string `json:"ownerId" gorm:"not null;index"`
	Owner   User   `gorm:"foreignKey:OwnerID"`

	PublicContact    string `json:"publicContact,omitempty"`
	PublicAddress    string `json:"publicAddress,omitempty"`
	PublicImageUrl   string `json:"publicImageUrl,omitempty"`
	PublicBannerUrl  string `json:"publicBannerUrl,omitempty"`
	PublicWebsiteUrl string `json:"publicWebsiteUrl,omitempty"`
	PublicSocials1   string `json:"publicSocials1,omitempty"`
	PublicSocials2   string `json:"publicSocials2,omitempty"`
	PublicSocials3   string `json:"publicSocials3,omitempty"`
	PublicSocials4   string `json:"publicSocials4,omitempty"`

	IsDeleted   bool                `json:"isDeleted" gorm:"not null;default:false"`
	CreatedAt   time.Time           `json:"createdAt"`
	UpdatedAt   time.Time           `json:"updatedAt"`
	DeletedAt   time.Time           `json:"deletedAt,omitzero"`
	Roles       []LawFirmRole       `gorm:"foreignKey:LawFirmID"`
	Memberships []LawFirmMembership `gorm:"foreignKey:LawFirmID"`
}

type LawFirmRole struct {
	ID            string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	LawFirmID     string    `json:"lawFirmId" gorm:"not null;index"`
	Name          string    `json:"name" gorm:"not null;type:varchar(255)"`
	PermRead      bool      `json:"permRead" gorm:"not null;default:false"`
	PermWrite     bool      `json:"permWrite" gorm:"not null;default:false"`
	PermManage    bool      `json:"permManage" gorm:"not null;default:false"`
	PermFirmAdmin bool      `json:"permAdmin" gorm:"not null;default:false"`
	IsDeleted     bool      `json:"isDeleted" gorm:"not null;default:false"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	DeletedAt     time.Time `json:"deletedAt,omitzero"`
}

type LawFirmMembership struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID    string    `json:"userId" gorm:"not null;index"`
	User      User      `gorm:"foreignKey:UserID" `
	LawFirmID string    `json:"lawFirmId" gorm:"not null;index"`
	RoleID    string    `json:"roleId" gorm:"not null;index"`
	JoinedAt  time.Time `json:"joinedAt" gorm:"autoCreateTime"`
}
