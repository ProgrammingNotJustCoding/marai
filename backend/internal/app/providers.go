package app

import (
	"marai/internal/config"
	"marai/internal/database"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func NewEcho() *echo.Echo {
	return echo.New()
}

func NewEnv() *config.Env {
	return config.LoadEnv()
}

func NewDB() (*gorm.DB, error) {
	return database.NewDB()
}
