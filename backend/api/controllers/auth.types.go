package controllers

import "marai/internal/database/schema"

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
	Token *schema.Session `json:"token,omitempty"`
	User  interface{}     `json:"user,omitempty"`
}
