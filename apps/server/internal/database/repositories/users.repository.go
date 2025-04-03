package repositories

import (
	"context"
	"errors"
	"marai/internal/database/schema"
	"time"

	ulid "github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) CreateUser(ctx context.Context, user *schema.User) error {
	user.ID = ulid.Make().String()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepo) GetUserByID(ctx context.Context, id int) (*schema.User, error) {
	var user schema.User
	result := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).Limit(50).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &user, nil
}

func (r *UserRepo) GetPublicUsersByUsername(ctx context.Context, username string) ([]*schema.User, error) {
	var users []*schema.User

	result := r.db.WithContext(ctx).
		Select("id, username, created_at").
		Where("username LIKE ? AND is_deleted = ?", (username + "%"), false).
		Limit(50).
		Find(&users)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return users, nil
}

func (r *UserRepo) GetUserByEmail(ctx context.Context, email string) (*schema.User, error) {
	var user schema.User
	result := r.db.WithContext(ctx).Where("email = ? AND is_deleted = ?", email, false).Limit(50).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &user, nil
}

func (r *UserRepo) GetUserByMobile(ctx context.Context, mobile string) (*schema.User, error) {
	var user schema.User
	result := r.db.WithContext(ctx).Where("mobile = ? AND is_deleted = ?", mobile, false).Limit(50).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &user, nil
}

func (r *UserRepo) GetUsers(ctx context.Context, page, pageSize int) ([]schema.User, int64, error) {
	var users []schema.User
	var total int64

	offset := (page - 1) * pageSize

	if err := r.db.WithContext(ctx).Model(&schema.User{}).Where("is_deleted = ?", false).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	result := r.db.WithContext(ctx).
		Select("id, username, email, mobile, is_email_verified, is_mobile_verified, is_deleted, is_super_admin, last_login_at, created_at, updated_at").
		Where("is_deleted = ?", false).
		Offset(offset).
		Limit(pageSize).
		Order("created_at DESC").
		Find(&users)

	if result.Error != nil {
		return nil, 0, result.Error
	}

	return users, total, nil
}

func (r *UserRepo) UpdateUser(ctx context.Context, user *schema.User) error {
	user.UpdatedAt = time.Now()

	result := r.db.WithContext(ctx).Model(user).
		Where("id = ? AND is_deleted = ?", user.ID, false).
		Updates(map[string]interface{}{
			"username":   user.Username,
			"email":      user.Email,
			"updated_at": time.Now(),
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *UserRepo) DeleteUser(ctx context.Context, id int) error {
	now := time.Now()
	result := r.db.WithContext(ctx).Model(&schema.User{}).
		Where("id = ? AND is_deleted = ?", id, false).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": now,
			"updated_at": now,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *UserRepo) HardDeleteUser(ctx context.Context, id int) error {
	result := r.db.WithContext(ctx).Unscoped().Delete(&schema.User{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}
