package repositories

import (
	"context"
	"errors"
	"marai/internal/database/schema"
	"time"

	ulid "github.com/oklog/ulid/v2"
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
		Preload("Owner", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
		Preload("Memberships.User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
		Preload("Roles", "is_deleted = ?", false).
		Where("id = ? AND is_deleted = ?", id, false).
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
			"name":               lawFirm.Name,
			"address":            lawFirm.Address,
			"phone":              lawFirm.Phone,
			"email":              lawFirm.Email,
			"public_contact":     lawFirm.PublicContact,
			"public_address":     lawFirm.PublicAddress,
			"public_image_url":   lawFirm.PublicImageUrl,
			"public_banner_url":  lawFirm.PublicBannerUrl,
			"public_website_url": lawFirm.PublicWebsiteUrl,
			"public_socials1":    lawFirm.PublicSocials1,
			"public_socials2":    lawFirm.PublicSocials2,
			"public_socials3":    lawFirm.PublicSocials3,
			"public_socials4":    lawFirm.PublicSocials4,
			"updated_at":         lawFirm.UpdatedAt,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("law firm not found")
	}
	return nil
}

func (r *LawFirmRepo) IsOwner(ctx context.Context, userID, lawFirmID string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&schema.LawFirm{}).
		Where("id = ? AND owner_id = ? AND is_deleted = ?", lawFirmID, userID, false).
		Count(&count).Error
	return count > 0, err
}

func (r *LawFirmRepo) HasAdminPermission(ctx context.Context, userID, lawFirmID string) (bool, error) {
	var membership schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Joins("JOIN law_firm_roles ON law_firm_memberships.role_id = law_firm_roles.id").
		Where("law_firm_memberships.user_id = ? AND law_firm_memberships.law_firm_id = ? AND law_firm_roles.perm_firm_admin = ?",
			userID, lawFirmID, true).
		First(&membership).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func (r *LawFirmRepo) HasPermission(ctx context.Context, userID, lawFirmID, permission string) (bool, error) {
	query := r.db.WithContext(ctx).
		Joins("JOIN law_firm_roles ON law_firm_memberships.role_id = law_firm_roles.id").
		Where("law_firm_memberships.user_id = ? AND law_firm_memberships.law_firm_id = ?",
			userID, lawFirmID)

	switch permission {
	case "read":
		query = query.Where("law_firm_roles.perm_read = ? OR law_firm_roles.perm_write = ? OR law_firm_roles.perm_manage = ? OR law_firm_roles.perm_firm_admin = ?",
			true, true, true, true)
	case "write":
		query = query.Where("law_firm_roles.perm_write = ? OR law_firm_roles.perm_manage = ? OR law_firm_roles.perm_firm_admin = ?",
			true, true, true)
	case "manage":
		query = query.Where("law_firm_roles.perm_manage = ? OR law_firm_roles.perm_firm_admin = ?",
			true, true)
	case "admin":
		query = query.Where("law_firm_roles.perm_firm_admin = ?", true)
	default:
		return false, errors.New("invalid permission type")
	}

	var membership schema.LawFirmMembership
	err := query.First(&membership).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	return true, nil
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
	role.PermFirmAdmin = false
	role.CreatedAt = time.Now()
	role.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Create(role).Error
}

func (r *LawFirmRepo) GetRoleByID(ctx context.Context, id string) (*schema.LawFirmRole, error) {
	var role schema.LawFirmRole
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).First(&role).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *LawFirmRepo) UpdateRole(ctx context.Context, role *schema.LawFirmRole) error {
	role.UpdatedAt = time.Now()
	result := r.db.WithContext(ctx).Model(&schema.LawFirmRole{}).
		Where("id = ? AND is_deleted = ?", role.ID, false).
		Updates(map[string]interface{}{
			"name":        role.Name,
			"perm_read":   role.PermRead,
			"perm_write":  role.PermWrite,
			"perm_manage": role.PermManage,
			"updated_at":  role.UpdatedAt,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("role not found")
	}
	return nil
}

func (r *LawFirmRepo) PromoteRoleToAdmin(ctx context.Context, roleID string) error {
	return r.db.WithContext(ctx).Model(&schema.LawFirmRole{}).Where("id = ? AND is_deleted = ?", roleID, false).Update("perm_manage", true).Error
}

func (r *LawFirmRepo) DemoteRoleFromAdmin(ctx context.Context, roleID string) error {
	return r.db.WithContext(ctx).Model(&schema.LawFirmRole{}).Where("id = ? AND is_deleted = ?", roleID, false).Update("perm_manage", false).Error
}

func (r *LawFirmRepo) DeleteRole(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Model(&schema.LawFirmRole{}).Where("id = ? AND is_deleted = ?", id, false).Update("is_deleted", true).Error
}

func (r *LawFirmRepo) CreateMembership(ctx context.Context, membership *schema.LawFirmMembership) error {
	membership.ID = ulid.Make().String()
	membership.JoinedAt = time.Now()
	return r.db.WithContext(ctx).Create(membership).Error
}

func (r *LawFirmRepo) GetMembershipByID(ctx context.Context, id string) (*schema.LawFirmMembership, error) {
	var membership schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
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
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id, username, email, mobile")
		}).
		Where("law_firm_id = ?", lawFirmID).
		Find(&memberships).Error
	return memberships, err
}

func (r *LawFirmRepo) GetMembershipsByUserID(ctx context.Context, userID string) ([]schema.LawFirmMembership, error) {
	var memberships []schema.LawFirmMembership
	err := r.db.WithContext(ctx).
		Preload("LawFirm").
		Where("user_id = ?", userID).
		Find(&memberships).Error
	return memberships, err
}

func (r *LawFirmRepo) UpdateMembership(ctx context.Context, membership *schema.LawFirmMembership) error {
	return r.db.WithContext(ctx).Model(membership).Updates(membership).Error
}

func (r *LawFirmRepo) DeleteMembership(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&schema.LawFirmMembership{}, "id = ?", id).Error
}

func (r *LawFirmRepo) IsMember(ctx context.Context, userID, lawFirmID string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&schema.LawFirmMembership{}).
		Where("user_id = ? AND law_firm_id = ?", userID, lawFirmID).
		Count(&count).Error
	return count > 0, err
}
