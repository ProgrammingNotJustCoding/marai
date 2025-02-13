package middlewares

import (
	"marai/api/constants"
	"marai/internal/database/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func AuthMiddleware(sessionRepo *repositories.SessionRepo) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			sessionID, err := c.Cookie("sessionID")
			if err != nil {
				return c.JSON(http.StatusUnauthorized, constants.ErrUnauthorized)
			}

			session, err := sessionRepo.GetSessionByToken(c.Request().Context(), sessionID.Value)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, constants.ErrUnauthorized)
			}

			c.Set("user", session.User)
			c.Set("session", session)
			return next(c)
		}
	}
}
