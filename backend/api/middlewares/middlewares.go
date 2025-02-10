package middlewares

import (
	"fmt"
	"marai/internal/config"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	m "github.com/labstack/echo/v4/middleware"
)

func SetupMiddlewares(app *echo.Echo) {
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
