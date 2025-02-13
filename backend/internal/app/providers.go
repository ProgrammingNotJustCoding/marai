package app

import (
	"marai/api/controllers"
	"marai/internal/config"
	"marai/internal/database"
	"marai/internal/database/repositories"
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type App struct {
	Echo           *echo.Echo
	DB             *gorm.DB
	UserRepo       *repositories.UserRepo
	AuthController *controllers.AuthController
	StartTime      time.Time
}

func NewApp(
	db *gorm.DB,
	userRepo *repositories.UserRepo,
	AuthController *controllers.AuthController,
) *App {
	e := echo.New()

	return &App{
		Echo:           e,
		DB:             db,
		UserRepo:       userRepo,
		AuthController: AuthController,
	}
}

func NewFxApp() *fx.App {
	config.LoadEnv()

	return fx.New(
		fx.Options(
			fx.Provide(
				NewEcho,
				NewDB,
				repositories.NewUserRepository,
				controllers.NewAuthController,
				NewApp,
			),
			fx.Invoke(
				Setup,
				RegisterHooks,
			),
		))
}

func NewEcho() *echo.Echo {
	return echo.New()
}

func NewDB() (*gorm.DB, error) {
	return database.NewDB()
}
