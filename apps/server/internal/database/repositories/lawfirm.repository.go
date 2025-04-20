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

func NewLawFirmRepo(db *gorm.DB) *LawFirmRepo {
	return &LawFirmRepo{db: db}
}

func (r *LawFirmRepo) CreateLawFirm(ctx context.Context, lawFirm *schema.LawFirm) error {
	if lawFirm.ID == "" {
		lawFirm.ID = ulid.Make().String()
	}
	lawFirm.CreatedAt = time.Now()
	lawFirm.UpdatedAt = time.Now()

	return r.db.WithContext(ctx).Create(lawFirm).Error
}

func (r *LawFirmRepo) GetLawFirmByID(ctx context.Context, id string) (*schema.LawFirm, error) {
	var lawFirm schema.LawFirm
	err := r.db.WithContext(ctx).Preload("Members").Preload("Roles").Where("id = ? AND is_deleted = ?", id, false).First(&lawFirm).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &lawFirm, nil
}

func (r *LawFirmRepo) GetLawFirmByEmail(ctx context.Context, email string) (*schema.LawFirm, error) {
	var lawFirm schema.LawFirm
	err := r.db.WithContext(ctx).Preload("Members").Preload("Roles").Where("email = ? AND is_deleted = ?", email, false).First(&lawFirm).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &lawFirm, nil
}

func (r *LawFirmRepo) GetLawFirmByMobile(ctx context.Context, mobile string) (*schema.LawFirm, error) {
	var lawFirm schema.LawFirm
	err := r.db.WithContext(ctx).Preload("Members").Preload("Roles").Where("mobile = ? AND is_deleted = ?", mobile, false).First(&lawFirm).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &lawFirm, nil
}

func (r *LawFirmRepo) UpdateLawFirm(ctx context.Context, lawFirm *schema.LawFirm) error {
	lawFirm.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(lawFirm).Error
}

func (r *LawFirmRepo) DeleteLawFirm(ctx context.Context, id string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&schema.LawFirm{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		}).Error
}

func (r *LawFirmRepo) GetAllLawFirms(ctx context.Context) ([]schema.LawFirm, error) {
	var lawFirms []schema.LawFirm
	err := r.db.WithContext(ctx).
		Where("is_deleted = ?", false).
		Find(&lawFirms).Error
	if err != nil {
		return nil, err
	}
	return lawFirms, nil
}

func (r *LawFirmRepo) CreateRole(ctx context.Context, role *schema.LawFirmRole) error {
	if role.ID == "" {
		role.ID = ulid.Make().String()
	}
	role.CreatedAt = time.Now()
	role.UpdatedAt = time.Now()

	return r.db.WithContext(ctx).Create(role).Error
}

func (r *LawFirmRepo) GetRoleByID(ctx context.Context, id string) (*schema.LawFirmRole, error) {
	var role schema.LawFirmRole
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).First(&role).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}

func (r *LawFirmRepo) GetRolesByLawFirmID(ctx context.Context, lawFirmID string) ([]schema.LawFirmRole, error) {
	var roles []schema.LawFirmRole
	err := r.db.WithContext(ctx).
		Where("law_firm_id = ? AND is_deleted = ?", lawFirmID, false).
		Find(&roles).Error
	if err != nil {
		return nil, err
	}
	return roles, nil
}

func (r *LawFirmRepo) UpdateRole(ctx context.Context, role *schema.LawFirmRole) error {
	role.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(role).Error
}

func (r *LawFirmRepo) DeleteRole(ctx context.Context, id string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&schema.LawFirmRole{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		}).Error
}

func (r *LawFirmRepo) CreateMember(ctx context.Context, member *schema.LawFirmMember) error {
	if member.ID == "" {
		member.ID = ulid.Make().String()
	}
	member.CreatedAt = time.Now()
	member.UpdatedAt = time.Now()

	return r.db.WithContext(ctx).Create(member).Error
}

func (r *LawFirmRepo) GetMemberByID(ctx context.Context, id string) (*schema.LawFirmMember, error) {
	var member schema.LawFirmMember
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).First(&member).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &member, nil
}

func (r *LawFirmRepo) GetMembersByLawFirmID(ctx context.Context, lawFirmID string) ([]schema.LawFirmMember, error) {
	var members []schema.LawFirmMember
	err := r.db.WithContext(ctx).
		Where("law_firm_id = ? AND is_deleted = ?", lawFirmID, false).
		Find(&members).Error
	if err != nil {
		return nil, err
	}
	return members, nil
}

func (r *LawFirmRepo) GetMemberByEmail(ctx context.Context, email string, lawFirmID string) (*schema.LawFirmMember, error) {
	var member schema.LawFirmMember
	err := r.db.WithContext(ctx).Where("email = ? AND law_firm_id = ? AND is_deleted = ?", email, lawFirmID, false).First(&member).Error
	if err != nil {
		return nil, err
	}
	return &member, nil
}

func (r *LawFirmRepo) UpdateMember(ctx context.Context, member *schema.LawFirmMember) error {
	member.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(member).Error
}

func (r *LawFirmRepo) DeleteMember(ctx context.Context, id string) error {
	now := time.Now()
	return r.db.WithContext(ctx).Model(&schema.LawFirmMember{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		}).Error
}

func (r *LawFirmRepo) IsOwner(userID string, lawFirmID string) bool {

	return userID == lawFirmID
}

func (r *LawFirmRepo) HasPermission(ctx context.Context, userID string, lawFirmID string, permission string) (bool, error) {
	var lawyerRole schema.LawFirmRole
	var member schema.LawFirmMember

	err := r.db.WithContext(ctx).Where("id = ? AND law_firm_id = ? AND is_deleted = ?", userID, lawFirmID, false).First(&member).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	err = r.db.WithContext(ctx).Where("id = ?", member.RoleID).First(&lawyerRole).Error
	if err != nil {
		return false, err
	}

	switch permission {
	case "read":
		if lawyerRole.PermRead {
			return true, nil
		}
	case "write":
		if lawyerRole.PermWrite {
			return true, nil
		}
	case "manage":
		if lawyerRole.PermManage {
			return true, nil
		}
	case "admin":
		if lawyerRole.PermFirmAdmin {
			return true, nil
		}
	}

	return false, nil
}

func (r *LawFirmRepo) HasAdminPermission(ctx context.Context, userID string, lawFirmID string) (bool, error) {
	return r.HasPermission(ctx, userID, lawFirmID, "admin")
}

func (r *LawFirmRepo) IsMember(ctx context.Context, email string, lawFirmID string) (bool, error) {
	var member schema.LawFirmMember
	err := r.db.WithContext(ctx).Where("member_email = ? AND law_firm_id = ? AND is_deleted = ?", email, lawFirmID, false).First(&member).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}

		return false, err
	}
	return member.ID != "", nil
}
