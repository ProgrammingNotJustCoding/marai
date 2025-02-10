package controllers

import "marai/internal/database/repositories"

type UserController struct {
	userRepo *repositories.UserRepo
}

func NewUserController(userRepo *repositories.UserRepo) *UserController {
	return &UserController{userRepo: userRepo}
}
