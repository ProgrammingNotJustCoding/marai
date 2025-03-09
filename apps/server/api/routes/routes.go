package routes

import (
	"marai/api/controllers"
	"marai/api/middlewares"
	"time"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(router *echo.Group,
	mW *middlewares.Middlewares,
	aC *controllers.AuthController,
	lC *controllers.LawFirmController,
	startTime time.Time,
) {

	router.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]any{
			"status":        200,
			"message":       "OK",
			"prettyMessage": "Server is running successfully",
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
	authRouter.GET("/user/public", aC.HandleGetPublicUsersByUsername)

	lawFirmRouter := router.Group("/lawfirms")
	lawFirmRouter.Use(mW.AuthMiddleware())

	lawFirmRouter.GET("", lC.HandleGetAllLawFirms)
	lawFirmRouter.GET("/me", lC.HandleListLawFirms)

	lawFirmRouter.POST("", lC.HandleCreateLawFirm)
	lawFirmRouter.GET("/:id", lC.HandleGetLawFirm)
	lawFirmRouter.PUT("/:id", lC.HandleUpdateLawFirm, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id", lC.HandleDeleteLawFirm, mW.RequireLawFirmOwnership())

	lawFirmRouter.GET("/:id/members", lC.HandleListMembers, mW.RequirePermission("read"))
	lawFirmRouter.POST("/:id/members", lC.HandleAddMember, mW.RequireLawFirmAdmin())
	lawFirmRouter.PUT("/:id/members/:memberId", lC.HandleUpdateMember, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id/members/:memberId", lC.HandleRemoveMember, mW.RequireLawFirmAdmin())

	lawFirmRouter.GET("/:id/roles", lC.HandleListRoles, mW.RequirePermission("read"))
	lawFirmRouter.POST("/:id/roles", lC.HandleCreateRole, mW.RequireLawFirmAdmin())
	lawFirmRouter.PUT("/:id/roles/:roleId", lC.HandleUpdateRole, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id/roles/:roleId", lC.HandleDeleteRole, mW.RequireLawFirmAdmin())

	lawFirmRouter.POST("/:id/roles/promote", lC.HandlePromoteRoleToAdmin, mW.RequireLawFirmOwnership())
	lawFirmRouter.POST("/:id/roles/demote", lC.HandleDemoteRoleFromAdmin, mW.RequireLawFirmOwnership())

	// TODO: Make usefull user routes later - like reset pwd, current cases, etc... etc...

	// TODO: Make usefull admin routes later

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "Route Not Found",
		})
	})
}
