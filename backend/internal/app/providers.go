package app

import (
	"marai/internal/config"

	"github.com/labstack/echo/v4"
)

func NewEcho() *echo.Echo {
	return echo.New()
}

func NewEnv() *config.Env {
	return config.LoadEnv()
}
