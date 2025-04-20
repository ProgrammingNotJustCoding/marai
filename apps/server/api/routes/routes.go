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
	conC *controllers.ConsultationController, // Added ConsultationController
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
	authRouter.POST("/user/signup/email/verify", aC.HandleUserSignupEmailVerify)
	authRouter.POST("/user/signup/mobile/verify", aC.HandleUserSignupMobileVerify)

	authRouter.POST("/user/signin/mobile/otp", aC.HandleSigninMobileOTP)
	authRouter.POST("/user/signin/mobile/verify", aC.HandleSigninMobileVerify)
	authRouter.POST("/user/signin/email/otp", aC.HandleSigninEmailOTP)
	authRouter.POST("/user/signin/email/verify", aC.HandleSigninEmailVerify)
	authRouter.POST("/user/signin/password", aC.HandleSigninPassword)
	authRouter.POST("/user/forgot-password", aC.HandleForgotPassword)
	authRouter.GET("/user/public", aC.HandleGetPublicUsersByUsername)

	authRouter.POST("/lawfirm/signup", aC.HandleLawFirmSignup) // TODO: Supposed to send email OTP and mobile OTP
	authRouter.POST("/lawfirm/signup/email/verify", aC.HandleLawFirmSignupVerifyEmail)
	authRouter.POST("/lawfirm/signup/mobile/verify", aC.HandleLawFirmSignupVerifyMobile)
	authRouter.POST("/lawfirm/signin/mobile/otp", aC.HandleLawFirmSigninMobile)
	authRouter.POST("/lawfirm/signin/mobile/verify", aC.HandleLawFirmSigninMobileVerify)
	authRouter.POST("/lawfirm/signin/email/otp", aC.HandleLawFirmSigninEmail)
	authRouter.POST("/lawfirm/signin/email/verify", aC.HandleLawFirmSigninEmailVerify)
	authRouter.POST("/lawfirm/signin/password", aC.HandleLawFirmSigninPassword)
	authRouter.POST("/lawfirm/forgot-password", aC.HandleLawFirmForgotPassword)

	authRouter.GET("/lawfirm/member/signin/password", aC.HandleLawFirmMemberSigninPassword)

	lawFirmRouter := router.Group("/lawfirms")
	lawFirmRouter.Use(mW.AuthMiddleware())

	lawFirmRouter.GET("", lC.HandleGetAllLawFirms)

	lawFirmRouter.GET("/:id", lC.HandleGetLawFirm)
	lawFirmRouter.PUT("/:id", lC.HandleUpdateLawFirm, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id", lC.HandleDeleteLawFirm, mW.RequireLawFirmOwnership())

	lawFirmRouter.POST("/:id/members/new", lC.HandleAddMember, mW.RequireLawFirmAdmin())
	lawFirmRouter.POST("/:id/members/reset-pa", lC.HandleResetMemberPassword, mW.RequireLawFirmAdmin())
	lawFirmRouter.GET("/:id/members", lC.HandleListMembers, mW.RequirePermission("read"))
	lawFirmRouter.PUT("/:id/members/:memberId", lC.HandleUpdateMember, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id/members/:memberId", lC.HandleRemoveMember, mW.RequireLawFirmAdmin())

	lawFirmRouter.GET("/:id/roles", lC.HandleListRoles, mW.RequirePermission("read"))
	lawFirmRouter.POST("/:id/roles/new", lC.HandleCreateRole, mW.RequireLawFirmAdmin())
	lawFirmRouter.PUT("/:id/roles/:roleId", lC.HandleUpdateRole, mW.RequireLawFirmAdmin())
	lawFirmRouter.DELETE("/:id/roles/:roleId", lC.HandleDeleteRole, mW.RequireLawFirmAdmin())

	lawFirmRouter.POST("/:id/roles/promote", lC.HandlePromoteRoleToAdmin, mW.RequireLawFirmOwnership())
	lawFirmRouter.POST("/:id/roles/demote", lC.HandleDemoteRoleFromAdmin, mW.RequireLawFirmOwnership())

	// TODO: Make useful user routes later - like reset pwd, current cases, etc... etc...

	// TODO: Make useful admin routes later

	keysGroup := router.Group("/keys")
	keysGroup.Use(mW.AuthMiddleware())

	keysGroup.GET("", kC.HandleListPublicKeys)
	keysGroup.POST("", kC.HandleGenerateKeyPair)
	keysGroup.PUT("/:keyID", kC.HandleUpdateKey)
	keysGroup.DELETE("/:keyID", kC.HandleDeleteKey)
	keysGroup.POST("/:keyID/download", kC.HandleDownloadKey)

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

	consultationRouter := router.Group("/consultations")
	consultationRouter.Use(mW.AuthMiddleware()) // All consultation routes require authentication

	consultationRouter.POST("", conC.HandleCreateConsultation)
	consultationRouter.GET("", conC.HandleListConsultations)
	consultationRouter.GET("/:id", conC.HandleGetConsultation)
	consultationRouter.POST("/:id/accept-firm", conC.HandleAcceptConsultation, mW.RequireLawFirmAdmin()) // Requires firm admin/owner
	consultationRouter.POST("/:id/assign-lawyer", conC.HandleAssignLawyer, mW.RequireLawFirmAdmin())     // Requires firm admin/owner
	consultationRouter.POST("/:id/accept-lawyer", conC.HandleAcceptByLawyer)                             // Requires assigned lawyer
	consultationRouter.POST("/:id/set-fees", conC.HandleSetFees)                                         // Requires assigned lawyer
	consultationRouter.POST("/:id/confirm-fees", conC.HandleConfirmFees)                                 // Requires the user who created it
	consultationRouter.POST("/:id/mark-taken", conC.HandleMarkAsTaken)                                   // Requires assigned lawyer
	consultationRouter.POST("/:id/documents", conC.HandleUploadDocument)
	consultationRouter.GET("/:id/documents", conC.HandleListDocuments)
	consultationRouter.GET("/:id/documents/:docId", conC.HandleGetDocument)
	consultationRouter.POST("/:id/chat", conC.HandleSendMessage)
	consultationRouter.GET("/:id/chat", conC.HandleListMessages)

	router.Any("/*", func(c echo.Context) error {
		return c.JSON(404, map[string]any{
			"status":        404,
			"message":       "Not Found",
			"prettyMessage": "Route Not Found",
		})
	})
}
