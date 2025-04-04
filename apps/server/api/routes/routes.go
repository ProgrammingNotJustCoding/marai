package routes

import (
	"marai/api/controllers"
	"marai/api/middlewares"
	"time"

	echo "github.com/labstack/echo/v4"
)

func SetupRoutes(router *echo.Group,
	mW *middlewares.Middlewares,
	aC *controllers.AuthController,
	lC *controllers.LawFirmController,
	cC *controllers.ContractsController,
	kC *controllers.KeysController,
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
	// TODO: below func is redundant, remove it later
	authRouter.POST("/user/signin/otp/resend", aC.HandleSigninOTPResend)
	authRouter.POST("/user/signin/password", aC.HandleSigninPassword)
	authRouter.GET("/user/public", aC.HandleGetPublicUsersByUsername)

	userGroup := router.Group("/keys")
	userGroup.Use(mW.AuthMiddleware())
	userGroup.GET("", kC.HandleListPublicKeys)
	userGroup.POST("/generate", kC.HandleGenerateKeyPair)
	userGroup.GET("/download/:keyId", kC.HandleDownloadPrivateKey)

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

	// TODO: Make useful user routes later - like reset pwd, current cases, etc... etc...

	// TODO: Make useful admin routes later

	// TODO Contracts routes
	contractsRouter := router.Group("/contracts")
	contractsRouter.Use(mW.AuthMiddleware())

	contractsRouter.POST("", cC.HandleCreateContract)
	contractsRouter.GET("/lawfirms/:lawFirmId", cC.HandleListContracts)
	contractsRouter.GET("/:id", cC.HandleGetContract)
	contractsRouter.PUT("/:id", cC.HandleUpdateContract)
	contractsRouter.DELETE("/:id", cC.HandleDeleteContract)

	contractsRouter.POST("/:id/file", cC.HandleUploadContractFile)
	contractsRouter.GET("/:id/file", cC.HandleGetContractFile)

	contractsRouter.GET("/:id/file/versions", cC.HandleListContractFileVersions)
	contractsRouter.GET("/:id/file/versions/:version", cC.HandleGetContractFileVersion)

	contractsRouter.POST("/:id/parties", cC.HandleAddContractParty)
	contractsRouter.DELETE("/:id/parties/:partyId", cC.HandleRemoveContractParty)

	contractsRouter.POST("/:id/sign", cC.HandleSignContract)

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "Route Not Found",
		})
	})
}
