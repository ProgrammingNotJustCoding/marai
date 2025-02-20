package controllers

import (
	"marai/api/constants"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"net/http"

	"github.com/labstack/echo/v4"
)

type AddMemberRequest struct {
	UserID string `json:"userId" validate:"required"`
	RoleID string `json:"roleId" validate:"required"`
}

type UpdateMemberRequest struct {
	RoleID string `json:"roleId" validate:"required"`
}

type LawfirmMembershipController struct {
	lawFirmRepo *repositories.LawFirmRepo
}

func NewLawfirmMembershipController(lawFirmRepo *repositories.LawFirmRepo) *LawfirmMembershipController {
	return &LawfirmMembershipController{
		lawFirmRepo: lawFirmRepo,
	}
}

func (mc *LawfirmMembershipController) AddMember(c echo.Context) error {
	lawFirmID := c.Param("id")
	req := new(AddMemberRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	isMember, err := mc.lawFirmRepo.IsMember(c.Request().Context(), req.UserID, lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if isMember {
		return c.JSON(http.StatusConflict, constants.ErrConflict)
	}

	membership := &schema.LawFirmMembership{
		UserID:    req.UserID,
		LawFirmID: lawFirmID,
		RoleID:    req.RoleID,
	}

	if err := mc.lawFirmRepo.CreateMembership(c.Request().Context(), membership); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:  http.StatusCreated,
		Message: "Member added successfully",
		Data:    membership,
	})
}

func (mc *LawfirmMembershipController) ListMembers(c echo.Context) error {
	lawFirmID := c.Param("id")
	memberships, err := mc.lawFirmRepo.GetMembershipsByLawFirmID(c.Request().Context(), lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Members retrieved successfully",
		Data:    memberships,
	})
}

func (mc *LawfirmMembershipController) UpdateMember(c echo.Context) error {
	membershipID := c.Param("memberId")
	req := new(UpdateMemberRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	membership, err := mc.lawFirmRepo.GetMembershipByID(c.Request().Context(), membershipID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if membership == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	membership.RoleID = req.RoleID

	if err := mc.lawFirmRepo.UpdateMembership(c.Request().Context(), membership); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Member updated successfully",
		Data:    membership,
	})
}

func (mc *LawfirmMembershipController) RemoveMember(c echo.Context) error {
	membershipID := c.Param("memberId")
	if err := mc.lawFirmRepo.DeleteMembership(c.Request().Context(), membershipID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Member removed successfully",
	})
}
