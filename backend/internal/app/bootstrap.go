package app

import (
	"marai/api/middlewares"
	"marai/api/routes"
	"marai/internal/config"

	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

var Module = fx.Options(
	fx.Provide(
		NewEcho,
		config.LoadEnv,
	),
	fx.Invoke(
		Setup,
		StartServer,
	),
)

func Setup(e *echo.Echo) {
	middlewares.SetupMiddlewares(e)
	api := e.Group("/api")
	routes.SetupRoutes(api)
}
