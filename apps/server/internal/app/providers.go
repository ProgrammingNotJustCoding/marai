package app

import (
	"marai/api/controllers"
	"marai/api/middlewares"
	"marai/internal/config"
	"marai/internal/database"
	"marai/internal/database/repositories"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/minio/minio-go/v7"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

type App struct {
	Echo               *echo.Echo
	DB                 *gorm.DB
	minioDB            *minio.Client
	Middlewares        *middlewares.Middlewares
	UserRepo           *repositories.UserRepo
	SessionRepo        *repositories.SessionRepo
	AuthController     *controllers.AuthController
	LawfirmController  *controllers.LawFirmController
	ContractController *controllers.ContractsController
	RoleCache          *middlewares.RoleCache
	StartTime          time.Time
}

func NewApp(
	db *gorm.DB,
	minioDB *minio.Client,
	mw *middlewares.Middlewares,
	UserRepo *repositories.UserRepo,
	SessionRepo *repositories.SessionRepo,
	AuthController *controllers.AuthController,
	LawfirmController *controllers.LawFirmController,
	ContractController *controllers.ContractsController,
	RoleCache *middlewares.RoleCache,
) *App {
	e := echo.New()

	return &App{
		Echo:               e,
		DB:                 db,
		minioDB:            minioDB,
		Middlewares:        mw,
		UserRepo:           UserRepo,
		SessionRepo:        SessionRepo,
		AuthController:     AuthController,
		LawfirmController:  LawfirmController,
		ContractController: ContractController,
		RoleCache:          RoleCache,
		StartTime:          time.Now(),
	}
}

func NewFxApp() *fx.App {
	config.LoadEnv()

	return fx.New(
		fx.Options(
			fx.Provide(
				database.NewPostgresDB,
				database.NewMinioDB,
				repositories.NewSessionRepository,
				repositories.NewUserRepository,
				repositories.NewLawFirmRepository,
				repositories.NewContractsRepository,
				controllers.NewAuthController,
				controllers.NewLawFirmController,
				controllers.NewContractsController,
				middlewares.NewRoleCache,
				middlewares.NewMiddlewares,
				NewApp,
			),
			fx.Invoke(
				Setup,
				RegisterHooks,
			),
		))
}
