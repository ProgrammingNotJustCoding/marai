package main

import (
	"marai/internal/app"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		app.Module,
	).Run()
}
