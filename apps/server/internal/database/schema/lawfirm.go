package schema

import "time"

type LawFirm struct {
	ID               string `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Name             string `json:"name" gorm:"unique;not null"`
	Address          string `json:"address,omitempty"`
	Phone            string `json:"phone,omitempty"`
	Email            string `json:"email" gorm:"unique;not null"`
	OwnerID          string `json:"ownerId" gorm:"not null;index"`
	Owner            User   `gorm:"foreignKey:OwnerID"`
	IsEmailVerified  bool   `json:"isEmailVerified,omitempty" gorm:"default:false"`
	IsMobileVerified bool   `json:"isMobileVerified,omitempty" gorm:"default:false"`
	IsDeleted        bool   `json:"isDeleted" gorm:"not null;default:false"`

	PublicContact    string `json:"publicContact,omitempty"`
	PublicAddress    string `json:"publicAddress,omitempty"`
	PublicImageUrl   string `json:"publicImageUrl,omitempty"`
	PublicBannerUrl  string `json:"publicBannerUrl,omitempty"`
	PublicWebsiteUrl string `json:"publicWebsiteUrl,omitempty"`
	PublicSocials1   string `json:"publicSocials1,omitempty"`
	PublicSocials2   string `json:"publicSocials2,omitempty"`
	PublicSocials3   string `json:"publicSocials3,omitempty"`
	PublicSocials4   string `json:"publicSocials4,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt,omitzero"`

	Roles   []LawFirmRole    `gorm:"foreignKey:LawFirmID"`
	Members []LawFirmMembers `gorm:"foreignKey:LawFirmID"`
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

type LawFirmMember struct {
	ID        string `json:"id" gorm:"primaryKey;type:varchar(36)"`
	LawFirmID string `json:"lawFirmId" gorm:"not null;index"`
	RoleID    string `json:"roleId" gorm:"not null;index"`

	MemberName      string `json:"memberName" gorm:"not null;type:varchar(255)"`
	MemberEmail     string `json:"memberEmail" gorm:"not null;type:varchar(255)"`
	MemberHash      string `json:"memberHash" gorm:"not null;type:varchar(255)"`
	MemberPhone     string `json:"memberPhone" gorm:"not null;type:varchar(255)"`
	MemberImageUrl  string `json:"memberImageUrl,omitempty" gorm:"type:varchar(255)"`
	MemberBannerUrl string `json:"memberBannerUrl,omitempty" gorm:"type:varchar(255)"`

	IsDeleted bool `json:"isDeleted" gorm:"not null;default:false"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt,omitzero"`
}
