package middlewares

import (
	"fmt"
	"marai/api/constants"
	"marai/internal/config"
	"marai/internal/database/repositories"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	m "github.com/labstack/echo/v4/middleware"
)

type Middlewares struct {
	sessionRepo *repositories.SessionRepo
}

func NewMiddlewares(sessionRepo *repositories.SessionRepo) *Middlewares {
	return &Middlewares{
		sessionRepo: sessionRepo,
	}
}

func (mw *Middlewares) SetupMiddlewares(app *echo.Echo) {
	app.Pre(m.RemoveTrailingSlash())
	app.Use(m.Logger())
	app.Use(m.Decompress())
	app.Use(m.CORSWithConfig(m.CORSConfig{
		AllowOrigins: []string{
			fmt.Sprintf("localhost:%s", config.GetEnv("PORT")),
			config.GetEnv("CLIENT_URL"),
		},
		AllowCredentials: true,
	}))
	app.Use(m.Secure())
	app.Use(session.Middleware(sessions.NewCookieStore([]byte(config.GetEnv("GORILLA_SESSIONS_KEY")))))
	app.Use(m.RateLimiter(m.NewRateLimiterMemoryStore(20)))
	app.Use(m.Recover())
}

func (mw *Middlewares) AuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			sessionID, err := c.Cookie("sessionID")
			if err != nil {
				c.Logger().Warn("pre Skill issue")

				return c.JSON(http.StatusUnauthorized, constants.ErrUnauthorized)
			}

			session, err := mw.sessionRepo.GetSessionByToken(c.Request().Context(), sessionID.Value)
			if err != nil {
				c.Logger().Warn("Skill issue")
				return c.JSON(http.StatusUnauthorized, constants.ErrUnauthorized)
			}

			c.Set("userID", session.UserID)
			c.Set("session", session)
			return next(c)
		}
	}
}
