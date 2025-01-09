package app

import (
	"log"
	"marai/api/middlewares"
	"marai/api/routes"
	"marai/internal/database"

	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
	"gorm.io/gorm"
)

var Module = fx.Options(
	fx.Provide(
		NewEcho,
		NewEnv,
		NewDB,
	),
	fx.Invoke(
		Setup,
		StartServer,
	),
)

func Setup(e *echo.Echo, db *gorm.DB) {
	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Error running migrations: %v", err)
		return
	}
	middlewares.SetupMiddlewares(e)
	api := e.Group("/api")
	routes.SetupRoutes(api)
}
