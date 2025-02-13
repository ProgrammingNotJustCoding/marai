package repositories

import (
	"context"
	"marai/internal/database/schema"
	"sync"
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type SessionRepo struct {
	db           *gorm.DB
	sessionCache map[string]*schema.Session
	cacheMutex   sync.RWMutex
}

func NewSessionRepository(db *gorm.DB) *SessionRepo {
	return &SessionRepo{
		db:           db,
		sessionCache: make(map[string]*schema.Session),
		cacheMutex:   sync.RWMutex{},
	}
}

func (r *SessionRepo) CreateSession(ctx context.Context, userID ulid.ULID) (*schema.Session, error) {
	session := &schema.Session{
		ID:        ulid.Make(),
		UserID:    userID,
		ExpiresAt: time.Now().Add(24 * 7 * time.Hour),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(session).Error; err != nil {
		return nil, err
	}

	r.cacheMutex.Lock()
	r.sessionCache[session.ID.String()] = session
	r.cacheMutex.Unlock()

	return session, nil
}

func (r *SessionRepo) GetSessionByToken(ctx context.Context, token string) (*schema.Session, error) {
	r.cacheMutex.RLock()
	if session, ok := r.sessionCache[token]; ok {
		if !session.IsRevoked && session.ExpiresAt.After(time.Now()) {
			r.cacheMutex.RUnlock()
			return session, nil
		}
	}
	r.cacheMutex.RUnlock()

	var session schema.Session
	if err := r.db.WithContext(ctx).
		Preload("User").
		Where("token = ? AND is_revoked = ? AND expires_at > ?", token, false, time.Now()).
		First(&session).Error; err != nil {
		return nil, err
	}

	r.cacheMutex.Lock()
	r.sessionCache[token] = &session
	r.cacheMutex.Unlock()

	return &session, nil
}

func (r *SessionRepo) RevokeSession(ctx context.Context, token string) error {
	err := r.db.WithContext(ctx).
		Model(&schema.Session{}).
		Where("token = ?", token).
		Update("is_revoked", true).Error

	if err == nil {
		r.cacheMutex.Lock()
		delete(r.sessionCache, token)
		r.cacheMutex.Unlock()
	}

	return err
}
