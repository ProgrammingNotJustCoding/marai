package repositories

import (
	"context"
	"marai/internal/database/schema"
	"sync"
	"time"

	ulid "github.com/oklog/ulid/v2"
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

func (r *SessionRepo) CreateSession(ctx context.Context, userID string) (*schema.Session, error) {
	session := &schema.Session{
		ID:        ulid.Make().String(),
		UserID:    userID,
		ExpiresAt: time.Now().Add(24 * 7 * time.Hour),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := r.db.WithContext(ctx).Create(session).Error; err != nil {
		return nil, err
	}

	r.cacheMutex.Lock()
	r.sessionCache[session.ID] = session
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
	if err := r.db.WithContext(ctx).First(&session, "id = ?", token).Error; err != nil {
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
		Where("id = ?", token).
		Update("is_revoked", true).Error

	if err == nil {
		r.cacheMutex.Lock()
		delete(r.sessionCache, token)
		r.cacheMutex.Unlock()
	}

	return err
}

// TODO: for super admins / admin routes
func (r *SessionRepo) ClearSessionCache() {
	r.cacheMutex.Lock()
	defer r.cacheMutex.Unlock()

	r.sessionCache = make(map[string]*schema.Session)
}
