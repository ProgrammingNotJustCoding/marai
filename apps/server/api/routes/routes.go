package routes

import (
	"marai/api/controllers"
	"marai/api/middlewares"
	"time"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(router *echo.Group,
	mw *middlewares.Middlewares,
	aC *controllers.AuthController,
	lC *controllers.LawFirmController,
	mC *controllers.LawfirmMembershipController,
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

	lawFirmRouter := router.Group("/lawfirms")
	lawFirmRouter.Use(mw.AuthMiddleware())

	lawFirmRouter.POST("", lC.CreateLawFirm)
	lawFirmRouter.GET("", lC.GetAllLawFirms)
	lawFirmRouter.GET("/me", lC.ListLawFirms)
	lawFirmRouter.GET("/:id", lC.GetLawFirm)
	lawFirmRouter.PUT("/:id", lC.UpdateLawFirm)
	lawFirmRouter.DELETE("/:id", lC.DeleteLawFirm)

	lawFirmRouter.POST("/:id/roles", lC.CreateRole)
	lawFirmRouter.GET("/:id/roles", lC.ListRoles)
	lawFirmRouter.PUT("/:id/roles/:roleId", lC.UpdateRole)
	lawFirmRouter.DELETE("/:id/roles/:roleId", lC.DeleteRole)

	lawFirmRouter.POST("/:id/members", mC.AddMember)
	lawFirmRouter.GET("/:id/members", mC.ListMembers)
	lawFirmRouter.PUT("/:id/members/:memberId", mC.UpdateMember)
	lawFirmRouter.DELETE("/:id/members/:memberId", mC.RemoveMember)

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "The requested resource was not found",
		})
	})
}
