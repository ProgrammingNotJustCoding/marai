package middlewares

import (
	"marai/api/constants"
	"net/http"
	"sync"

	"github.com/labstack/echo/v4"
)

type RoleCache struct {
	userRoles map[string]map[string]string
	mutex     sync.RWMutex
}

func NewRoleCache() *RoleCache {
	return &RoleCache{
		userRoles: make(map[string]map[string]string),
		mutex:     sync.RWMutex{},
	}
}

func (rc *RoleCache) Set(userID, lawFirmID, roleID string) {
	rc.mutex.Lock()
	defer rc.mutex.Unlock()

	if _, exists := rc.userRoles[userID]; !exists {
		rc.userRoles[userID] = make(map[string]string)
	}
	rc.userRoles[userID][lawFirmID] = roleID
}

func (rc *RoleCache) Get(userID, lawFirmID string) (string, bool) {
	rc.mutex.RLock()
	defer rc.mutex.RUnlock()

	if userRoles, exists := rc.userRoles[userID]; exists {
		roleID, exists := userRoles[lawFirmID]
		return roleID, exists
	}
	return "", false
}

func (rc *RoleCache) Delete(userID, lawFirmID string) {
	rc.mutex.Lock()
	defer rc.mutex.Unlock()

	if userRoles, exists := rc.userRoles[userID]; exists {
		delete(userRoles, lawFirmID)
		if len(userRoles) == 0 {
			delete(rc.userRoles, userID)
		}
	}
}

func (mw *Middlewares) RequireLawFirmOwnership() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userID := c.Get("userID").(string)
			lawFirmID := c.Param("id")

			isOwner, err := mw.lawFirmRepo.IsOwner(c.Request().Context(), userID, lawFirmID)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}

			if !isOwner {
				return c.JSON(http.StatusForbidden, constants.Error{
					Status:        403,
					Message:       "Forbidden",
					PrettyMessage: "You do not have permission to perform this action",
				})
			}

			return next(c)
		}
	}
}

func (mw *Middlewares) RequireLawFirmAdmin() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userID := c.Get("userID").(string)
			lawFirmID := c.Param("id")

			isOwner, err := mw.lawFirmRepo.IsOwner(c.Request().Context(), userID, lawFirmID)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}

			if isOwner {
				return next(c)
			}

			isAdmin, err := mw.lawFirmRepo.HasAdminPermission(c.Request().Context(), userID, lawFirmID)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}

			if !isAdmin {
				return c.JSON(http.StatusForbidden, constants.Error{
					Status:        403,
					Message:       "Forbidden",
					PrettyMessage: "You do not have permission to perform this action",
				})
			}

			return next(c)
		}
	}
}

func (mw *Middlewares) RequirePermission(permission string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			userID := c.Get("userID").(string)
			lawFirmID := c.Param("id")

			isOwner, err := mw.lawFirmRepo.IsOwner(c.Request().Context(), userID, lawFirmID)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}

			if isOwner {
				return next(c)
			}

			hasPerm, err := mw.lawFirmRepo.HasPermission(c.Request().Context(), userID, lawFirmID, permission)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}

			if !hasPerm {
				return c.JSON(http.StatusForbidden, constants.Error{
					Status:        403,
					Message:       "Forbidden",
					PrettyMessage: "You do not have permission to perform this action",
				})
			}

			return next(c)
		}
	}
}
