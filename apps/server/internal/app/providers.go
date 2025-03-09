package app

import (
	"marai/api/controllers"
	"marai/api/middlewares"
	"marai/internal/config"
	"marai/internal/database"
	"marai/internal/database/repositories"
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type App struct {
	Echo              *echo.Echo
	DB                *gorm.DB
	Middlewares       *middlewares.Middlewares
	UserRepo          *repositories.UserRepo
	SessionRepo       *repositories.SessionRepo
	AuthController    *controllers.AuthController
	LawfirmController *controllers.LawFirmController
	RoleCache         *middlewares.RoleCache
	StartTime         time.Time
}

func NewApp(
	db *gorm.DB,
	mw *middlewares.Middlewares,
	UserRepo *repositories.UserRepo,
	SessionRepo *repositories.SessionRepo,
	AuthController *controllers.AuthController,
	LawfirmController *controllers.LawFirmController,
) *App {
	e := echo.New()

	return &App{
		Echo:              e,
		DB:                db,
		Middlewares:       mw,
		UserRepo:          UserRepo,
		SessionRepo:       SessionRepo,
		AuthController:    AuthController,
		LawfirmController: LawfirmController,
		RoleCache:         middlewares.NewRoleCache(),
		StartTime:         time.Now(),
	}
}

func NewFxApp() *fx.App {
	config.LoadEnv()

	return fx.New(
		fx.Options(
			fx.Provide(
				NewDB,
				repositories.NewSessionRepository,
				repositories.NewUserRepository,
				repositories.NewLawFirmRepository,
				controllers.NewAuthController,
				controllers.NewLawFirmController,
				middlewares.NewMiddlewares,
				NewApp,
			),
			fx.Invoke(
				Setup,
				RegisterHooks,
			),
		))
}

func NewDB() (*gorm.DB, error) {
	return database.NewDB()
}
