package middlewares

import (
	"github.com/labstack/echo/v4"
	m "github.com/labstack/echo/v4/middleware"
)

func SetupMiddlewares(e *echo.Echo) {
	e.Pre(m.RemoveTrailingSlash())
	e.Use(m.Logger())
	e.Use(m.Decompress())
	e.Use(m.RateLimiter(m.NewRateLimiterMemoryStore(10)))
	e.Use(m.Secure())
}
