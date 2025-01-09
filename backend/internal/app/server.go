package app

import (
	"context"
	"fmt"
	"marai/internal/config"

	"github.com/labstack/echo/v4"
	"go.uber.org/fx"
)

func StartServer(lc fx.Lifecycle, e *echo.Echo, env *config.Env) {
	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go func() {
				if err := e.Start(fmt.Sprintf(":%s", env.Port)); err != nil {
					e.Logger.Error(err)
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			return e.Shutdown(ctx)
		},
	})
}
