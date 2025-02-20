package repositories

import (
	"context"
	"errors"
	"marai/internal/database/schema"
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type LawFirmRepo struct {
	db *gorm.DB
}

func NewLawFirmRepository(db *gorm.DB) *LawFirmRepo {
	return &LawFirmRepo{db: db}
}

type GetLawFirms struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (r *LawFirmRepo) GetAllLawFirms(ctx context.Context) ([]GetLawFirms, error) {
	var lawFirms []GetLawFirms
	err := r.db.WithContext(ctx).Model(&schema.LawFirm{}).Select("id", "name", "address", "created_at", "updated_at").Where("is_deleted = ?", false).Find(&lawFirms).Error
	if err != nil {
		return nil, err
	}

	return lawFirms, nil
}

func (r *LawFirmRepo) CreateLawFirm(ctx context.Context, lawFirm *schema.LawFirm) error {
	lawFirm.ID = ulid.Make().String()
	lawFirm.CreatedAt = time.Now()
	lawFirm.UpdatedAt = time.Now()

	return r.db.WithContext(ctx).Create(lawFirm).Error
}

func (r *LawFirmRepo) GetLawFirmByID(ctx context.Context, id string) (*schema.LawFirm, error) {
	var lawFirm schema.LawFirm
	result := r.db.WithContext(ctx).
		Preload("Owner").
		Preload("Roles").
		Preload("Memberships.User").
		Preload("Memberships.Role").
		Where("id = ?", id).
		First(&lawFirm)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}
	return &lawFirm, nil
}

func (r *LawFirmRepo) GetLawFirmsByOwnerID(ctx context.Context, ownerID string) ([]GetLawFirms, error) {
	var lawFirms []GetLawFirms
	err := r.db.WithContext(ctx).Model(&schema.LawFirm{}).Select("id", "name", "address", "created_at", "updated_at").Where("owner_id = ? and is_deleted = ?", ownerID, false).Find(&lawFirms).Error
	if err != nil {
		return nil, err
	}

	return lawFirms, nil
}

func (r *LawFirmRepo) UpdateLawFirm(ctx context.Context, lawFirm *schema.LawFirm) error {
	lawFirm.UpdatedAt = time.Now()
	result := r.db.WithContext(ctx).Model(lawFirm).
		Updates(map[string]interface{}{
			"name":       lawFirm.Name,
			"address":    lawFirm.Address,
			"phone":      lawFirm.Phone,
			"email":      lawFirm.Email,
			"updated_at": lawFirm.UpdatedAt,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("law firm not found")
	}
	return nil
}

func (r *LawFirmRepo) DeleteLawFirm(ctx context.Context, id string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&schema.LawFirm{}).Where("id = ?", id).Updates(&schema.LawFirm{IsDeleted: true, DeletedAt: now}).Error; err != nil {
			return err
		}

		if err := tx.Model(&schema.LawFirmMembership{}).
			Where("law_firm_id = ?", id).
			Delete(&schema.LawFirmMembership{}).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *LawFirmRepo) CreateRole(ctx context.Context, role *schema.LawFirmRole) error {
	role.ID = ulid.Make().String()
	role.CreatedAt = time.Now()
	role.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Create(role).Error
}

func (r *LawFirmRepo) GetRoleByID(ctx context.Context, id string) (*schema.LawFirmRole, error) {
	var role schema.LawFirmRole
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&role).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *LawFirmRepo) UpdateRole(ctx context.Context, role *schema.LawFirmRole) error {
	role.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Model(role).Updates(role).Error
}

func (r *LawFirmRepo) DeleteRole(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&schema.LawFirmRole{}, id).Error
}

func (r *LawFirmRepo) CreateMembership(ctx context.Context, membership *schema.LawFirmMembership) error {
	membership.ID = ulid.Make().String()
	membership.JoinedAt = time.Now()
	return r.db.WithContext(ctx).Create(membership).Error
}

func (r *LawFirmRepo) GetMembershipByID(ctx context.Context, id string) (*schema.LawFirmMembership, error) {
	var membership schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("LawFirm").
		Preload("Role").
		Where("id = ?", id).
		First(&membership).Error
	if err != nil {
		return nil, err
	}
	return &membership, nil
}

func (r *LawFirmRepo) GetMembershipsByLawFirmID(ctx context.Context, lawFirmID string) ([]schema.LawFirmMembership, error) {
	var memberships []schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("Role").
		Where("law_firm_id = ?", lawFirmID).
		Find(&memberships).Error
	return memberships, err
}

func (r *LawFirmRepo) GetMembershipsByUserID(ctx context.Context, userID string) ([]schema.LawFirmMembership, error) {
	var memberships []schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("LawFirm").
		Preload("Role").
		Where("user_id = ?", userID).
		Find(&memberships).Error
	return memberships, err
}

func (r *LawFirmRepo) UpdateMembership(ctx context.Context, membership *schema.LawFirmMembership) error {
	return r.db.WithContext(ctx).Model(membership).Updates(membership).Error
}

func (r *LawFirmRepo) DeleteMembership(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&schema.LawFirmMembership{}, id).Error
}

func (r *LawFirmRepo) IsMember(ctx context.Context, userID, lawFirmID string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&schema.LawFirmMembership{}).
		Where("user_id = ? AND law_firm_id = ?", userID, lawFirmID).
		Count(&count).Error
	return count > 0, err
}

func (r *LawFirmRepo) GetUserRole(ctx context.Context, userID, lawFirmID string) (*schema.LawFirmRole, error) {
	var membership schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("Role").
		Where("user_id = ? AND law_firm_id = ?", userID, lawFirmID).
		First(&membership).Error
	if err != nil {
		return nil, err
	}
	return &membership.Role, nil
}
