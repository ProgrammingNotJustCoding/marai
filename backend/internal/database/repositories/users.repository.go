package repositories

import (
	"context"
	"errors"
	"marai/internal/database/schema"
	"time"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(ctx context.Context, user *schema.User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result := r.db.WithContext(ctx).Create(user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *UserRepository) GetUserByID(ctx context.Context, id int) (*schema.User, error) {
	var user schema.User
	result := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &user, nil
}

func (r *UserRepository) GetUserByEmail(ctx context.Context, email string) (*schema.User, error) {
	var user schema.User
	result := r.db.WithContext(ctx).Where("email = ? AND is_deleted = ?", email, false).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &user, nil
}

func (r *UserRepository) GetUsers(ctx context.Context, page, pageSize int) ([]schema.User, int64, error) {
	var users []schema.User
	var total int64

	offset := (page - 1) * pageSize

	if err := r.db.WithContext(ctx).Model(&schema.User{}).Where("is_deleted = ?", false).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	result := r.db.WithContext(ctx).
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

func (r *UserRepository) UpdateUser(ctx context.Context, user *schema.User) error {
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

func (r *UserRepository) DeleteUser(ctx context.Context, id int) error {
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

func (r *UserRepository) HardDeleteUser(ctx context.Context, id int) error {
	result := r.db.WithContext(ctx).Unscoped().Delete(&schema.User{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}
