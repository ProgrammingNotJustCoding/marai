package routes

import (
	"time"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(router *echo.Group) {
	startTime := time.Now()

	router.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]any{
			"status":        200,
			"message":       "OK",
			"prettyMessage": "Server is running suvvessfully",
			"uptime":        time.Since(startTime).String(),
		})
	})

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "The requested resource was not found",
		})
	})
}
