package controllers

import (
	"marai/api/constants"
	"marai/internal/config"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"net/http"
	"strings"
	"time"

	echo "github.com/labstack/echo/v4"

	"golang.org/x/crypto/bcrypt"

	twilio "github.com/twilio/twilio-go"
	verify "github.com/twilio/twilio-go/rest/verify/v2"
)

type SignupRequest struct {
	Username string `json:"username" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Mobile   string `json:"mobile" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type VerifyOTPRequest struct {
	Mobile string `json:"mobile" validate:"required"`
	OTP    string `json:"otp" validate:"required,len=6"`
}

type SigninOTPRequest struct {
	Mobile string `json:"mobile" validate:"required"`
}

type SigninPasswordRequest struct {
	Mobile   string `json:"mobile" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
	SessionID string      `json:"sessionID,omitempty"`
	User      interface{} `json:"user,omitempty"`
}

type PublicUserRequest struct {
	UserName string `json:"username" validate:"required"`
}

type AuthController struct {
	twilioSID     string
	twillioClient *twilio.RestClient
	userRepo      *repositories.UserRepo
	sessionRepo   *repositories.SessionRepo
}

func NewAuthController(userRepo *repositories.UserRepo, sessionRepo *repositories.SessionRepo) *AuthController {
	return &AuthController{
		userRepo:      userRepo,
		sessionRepo:   sessionRepo,
		twillioClient: twilio.NewRestClient(),
		twilioSID:     config.GetEnv("TWILIO_VERIFY_SERVICE_ID"),
	}
}

func (a *AuthController) sendOtp(c echo.Context, mobileNo string) error {
	params := &verify.CreateVerificationParams{}
	params.SetTo(mobileNo)
	params.SetChannel("sms")

	resp, err := a.twillioClient.VerifyV2.CreateVerification(a.twilioSID, params)
	if err != nil {
		c.Logger().Error(err)
		return err
	}
	if resp.Sid == nil {
		c.Logger().Error("Error sending OTP")
		return err
	}

	return nil
}

func (a *AuthController) verifyOtp(c echo.Context, mobileNo string, otp string) (isValid bool, error error) {
	client := twilio.NewRestClient()

	params := &verify.CreateVerificationCheckParams{}
	params.SetTo(mobileNo)
	params.SetCode(otp)

	resp, err := client.VerifyV2.CreateVerificationCheck(a.twilioSID, params)
	if err != nil {
		c.Logger().Error(err)
		return false, err
	}

	if *resp.Status == "approved" {
		return true, nil
	}

	return false, nil
}

func (a *AuthController) HandleUserSignup(c echo.Context) error {
	reqUser := new(SignupRequest)
	if err := c.Bind(reqUser); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	existingUser, err := a.userRepo.GetUserByMobile(c.Request().Context(), reqUser.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if existingUser != nil && existingUser.IsMobileVerified {
		return c.JSON(http.StatusConflict, map[string]string{
			"message": "User already exists",
		})
	}

	if existingUser == nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(reqUser.Password), bcrypt.DefaultCost)
		if err != nil {
			c.Logger().Error("Password hashing failed:", err)
			return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
		}

		user := &schema.User{
			Username:     reqUser.Username,
			Email:        reqUser.Email,
			Mobile:       reqUser.Mobile,
			PasswordHash: string(hashedPassword),
		}

		if err := a.userRepo.CreateUser(c.Request().Context(), user); err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				c.Logger().Error("Failed to create user:", err)
				return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
			}
		}
	}

	if err := a.sendOtp(c, reqUser.Mobile); err != nil {
		c.Logger().Error("Failed to send OTP:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "OTP sent successfully",
		"data": map[string]string{
			"mobile": reqUser.Mobile,
		},
	})
}

func (a *AuthController) HandleUserSignupVerify(c echo.Context) error {
	reqUser := new(VerifyOTPRequest)
	if err := c.Bind(reqUser); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetUserByMobile(c.Request().Context(), reqUser.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	ok, err := a.verifyOtp(c, reqUser.Mobile, reqUser.OTP)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"status":  401,
			"message": "Invalid OTP",
		})
	}

	user.IsMobileVerified = true
	if err := a.userRepo.UpdateUser(c.Request().Context(), user); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, AuthResponse{
		User: user,
	})
}

func (a *AuthController) HandleSigninOTP(c echo.Context) error {
	req := new(SigninOTPRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetUserByMobile(c.Request().Context(), req.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if user == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if err := a.sendOtp(c, req.Mobile); err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":  200,
		"message": "OTP sent successfully",
		"data": map[string]interface{}{
			"mobile": req.Mobile,
		},
	})
}

func (a *AuthController) HandleSigninOTPVerify(c echo.Context) error {
	req := new(VerifyOTPRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetUserByMobile(c.Request().Context(), req.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	ok, err := a.verifyOtp(c, req.Mobile, req.OTP)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"status":  401,
			"message": "Invalid OTP",
		})
	}
	now := time.Now()
	user.LastLoginAt = &now

	session, err := a.sessionRepo.CreateSession(c.Request().Context(), user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	if err := a.userRepo.UpdateUser(c.Request().Context(), user); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	c.SetCookie(&http.Cookie{
		Name:     "sessionID",
		Value:    session.ID,
		Expires:  session.ExpiresAt,
		HttpOnly: true,
		Path:     "/",
	})

	return c.JSON(http.StatusOK, AuthResponse{
		SessionID: session.ID,
		User:      user,
	})
}

func (a *AuthController) HandleSigninOTPResend(c echo.Context) error {
	req := new(SigninOTPRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetUserByMobile(c.Request().Context(), req.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if user == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if err := a.sendOtp(c, req.Mobile); err != nil {
		c.Logger().Error(err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":  200,
		"message": "OTP resent successfully",
	})
}

func (a *AuthController) HandleSigninPassword(c echo.Context) error {
	req := new(SigninPasswordRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetUserByMobile(c.Request().Context(), req.Mobile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if user == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, constants.ErrUnauthorized)
	}

	now := time.Now()
	user.LastLoginAt = &now
	if err := a.userRepo.UpdateUser(c.Request().Context(), user); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	session, err := a.sessionRepo.CreateSession(c.Request().Context(), user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	c.SetCookie(&http.Cookie{
		Name:     "sessionID",
		Value:    session.ID,
		Expires:  session.ExpiresAt,
		HttpOnly: true,
		Path:     "/",
	})

	return c.JSON(http.StatusOK, AuthResponse{
		SessionID: session.ID,
		User:      user,
	})
}

func (a *AuthController) HandleGetPublicUsersByUsername(c echo.Context) error {
	req := new(PublicUserRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	user, err := a.userRepo.GetPublicUsersByUsername(c.Request().Context(), req.UserName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if user == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	return c.JSON(http.StatusOK, user)
}
