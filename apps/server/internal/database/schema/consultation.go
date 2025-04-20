package schema

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type ConsultationStatus string

const (
	StatusNew              ConsultationStatus = "new"
	StatusAcceptedByFirm   ConsultationStatus = "accepted-by-lawfirm"
	StatusAssigned         ConsultationStatus = "assigned"
	StatusAcceptedByLawyer ConsultationStatus = "accepted-by-lawyer"
	StatusConfirmed        ConsultationStatus = "confirmed" // Fees agreed by user
	StatusTaken            ConsultationStatus = "taken"     // Marked as case by lawyer
	StatusRejectedByFirm   ConsultationStatus = "rejected-by-lawfirm"
	StatusRejectedByLawyer ConsultationStatus = "rejected-by-lawyer"
	StatusClosed           ConsultationStatus = "closed" // Case completed or terminated
)

// FeeMap represents the map[string]int type for GORM
type FeeMap map[string]int

// Value implements the driver.Valuer interface for FeeMap
func (fm FeeMap) Value() (driver.Value, error) {
	if fm == nil {
		return nil, nil
	}
	return json.Marshal(fm)
}

// Scan implements the sql.Scanner interface for FeeMap
func (fm *FeeMap) Scan(value interface{}) error {
	if value == nil {
		*fm = nil
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New(fmt.Sprint("Failed to unmarshal JSONB value:", value))
	}
	return json.Unmarshal(bytes, fm)
}

type Consultation struct {
	ID               string             `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID           string             `json:"userId" gorm:"index;not null"`
	LawFirmID        string             `json:"lawFirmId" gorm:"index;not null"`
	AssignedLawyerID *string            `json:"assignedLawyerId,omitempty" gorm:"index"`
	CaseDetails      string             `json:"caseDetails" gorm:"type:text"`
	Status           ConsultationStatus `json:"status" gorm:"type:varchar(50);default:'new';index"`
	Fees             FeeMap             `json:"fees,omitempty" gorm:"type:jsonb"`
	IsTaken          bool               `json:"isTaken" gorm:"default:false"`
	CreatedAt        time.Time          `json:"createdAt"`
	UpdatedAt        time.Time          `json:"updatedAt"`

	User           User           `json:"user,omitempty" gorm:"foreignKey:UserID;references:ID"`
	LawFirm        LawFirm        `json:"lawFirm,omitempty" gorm:"foreignKey:LawFirmID;references:ID"`
	AssignedLawyer *LawFirmMember `json:"assignedLawyer,omitempty" gorm:"foreignKey:AssignedLawyerID;references:ID"` // Assuming LawFirmMember ID is the lawyer's ID
	Documents      []Document     `json:"documents,omitempty" gorm:"foreignKey:ConsultationID"`
	ChatMessages   []ChatMessage  `json:"chatMessages,omitempty" gorm:"foreignKey:ConsultationID"`
}
