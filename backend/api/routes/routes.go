package routes

import (
	"marai/api/controllers"
	"time"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(router *echo.Group,
	aC *controllers.AuthController,
) {
	startTime := time.Now()

	router.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]any{
			"status":        200,
			"message":       "OK",
			"prettyMessage": "Server is running suvvessfully",
			"uptime":        time.Since(startTime).String(),
		})
	})

	authRouter := router.Group("/auth")

	authRouter.POST("/user/signup", aC.HandleUserSignup)
	authRouter.POST("/user/signup/verify", aC.HandleUserSignupVerify)

	authRouter.POST("/user/signin/otp", aC.HandleSigninOTP)
	authRouter.POST("/user/signin/otp/verify", aC.HandleSigninOTPVerify)
	authRouter.POST("/user/signin/otp/resend", aC.HandleSigninOTPResend)
	authRouter.POST("/user/signin/password", aC.HandleSigninPassword)

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "The requested resource was not found",
		})
	})
}
