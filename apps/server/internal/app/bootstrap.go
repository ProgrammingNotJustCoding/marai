package app

import (
	"context"
	"log"
	"marai/api/routes"
	"marai/internal/config"
	"marai/internal/database"
	"net/http"
	"time"

	_ "net/http/pprof"

	"go.uber.org/fx"
)

func (a *App) Start(ctx context.Context) error {
	a.StartTime = time.Now()
	address := config.GetServerAddress()
	go func() {
		if err := a.Echo.Start(address); err != nil {
			log.Printf("Error starting server: %v", err)
		}
	}()
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()
	return nil
}

func (a *App) Stop(ctx context.Context) error {
	return a.Echo.Shutdown(ctx)
}

func RegisterHooks(lc fx.Lifecycle, app *App) {
	lc.Append(fx.Hook{
		OnStart: app.Start,
		OnStop:  app.Stop,
	})
}

func Setup(app *App) {
	if err := database.RunMigrations(app.DB); err != nil {
		log.Fatalf("Error running migrations: %v", err)
		return
	}

	app.Middlewares.SetupMiddlewares(app.Echo)
	api := app.Echo.Group("/api")
	routes.SetupRoutes(api,
		app.Middlewares,
		app.AuthController,
		app.LawfirmController,
		app.StartTime,
	)
}
