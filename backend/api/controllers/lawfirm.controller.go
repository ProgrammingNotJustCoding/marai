package controllers

import (
	"marai/api/constants"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

type CreateLawFirmRequest struct {
	Name    string `json:"name" validate:"required"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email" validate:"required,email"`
}

type UpdateLawFirmRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email" validate:"email"`
}

type CreateRoleRequest struct {
	Name          string `json:"name" validate:"required"`
	LawFirmID     string `json:"lawFirmId" validate:"required"`
	PermRead      bool   `json:"permRead"`
	PermWrite     bool   `json:"permWrite"`
	PermManage    bool   `json:"permManage"`
	PermFirmAdmin bool   `json:"permFirmAdmin"`
}

type LawFirmController struct {
	lawFirmRepo *repositories.LawFirmRepo
}

func NewLawFirmController(lawFirmRepo *repositories.LawFirmRepo) *LawFirmController {
	return &LawFirmController{
		lawFirmRepo: lawFirmRepo,
	}
}

func (lc *LawFirmController) GetAllLawFirms(c echo.Context) error {
	lawFirms, err := lc.lawFirmRepo.GetAllLawFirms(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firms retrieved successfully",
		Data:    lawFirms,
	})
}

func (lc *LawFirmController) CreateLawFirm(c echo.Context) error {
	req := new(CreateLawFirmRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	userID := c.Get("userID").(string)
	lawFirm := &schema.LawFirm{
		Name:    req.Name,
		Address: req.Address,
		Phone:   req.Phone,
		Email:   req.Email,
		OwnerID: userID,
	}

	if err := lc.lawFirmRepo.CreateLawFirm(c.Request().Context(), lawFirm); err != nil {
		if strings.Contains(err.Error(), "ERROR: duplicate key value violates unique constraint \"uni_law_firms_email\"") {
			return c.JSON(http.StatusConflict, constants.ErrConflict)
		}

		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Law firm created successfully",
		PrettyMessage: "Law firm has been created successfully",
		Data:          lawFirm,
	})
}

func (lc *LawFirmController) GetLawFirm(c echo.Context) error {
	id := c.Param("id")
	lawFirm, err := lc.lawFirmRepo.GetLawFirmByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if lawFirm == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firm retrieved successfully",
		Data:    lawFirm,
	})
}

func (lc *LawFirmController) ListLawFirms(c echo.Context) error {
	userID := c.Get("userID").(string)
	lawFirms, err := lc.lawFirmRepo.GetLawFirmsByOwnerID(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firms retrieved successfully",
		Data:    lawFirms,
	})
}

func (lc *LawFirmController) UpdateLawFirm(c echo.Context) error {
	id := c.Param("id")
	req := new(UpdateLawFirmRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	lawFirm, err := lc.lawFirmRepo.GetLawFirmByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if lawFirm == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if req.Name != "" {
		lawFirm.Name = req.Name
	}
	if req.Address != "" {
		lawFirm.Address = req.Address
	}
	if req.Phone != "" {
		lawFirm.Phone = req.Phone
	}
	if req.Email != "" {
		lawFirm.Email = req.Email
	}

	if err := lc.lawFirmRepo.UpdateLawFirm(c.Request().Context(), lawFirm); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firm updated successfully",
		Data:    lawFirm,
	})
}

func (lc *LawFirmController) DeleteLawFirm(c echo.Context) error {
	id := c.Param("id")
	if err := lc.lawFirmRepo.DeleteLawFirm(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firm deleted successfully",
	})
}

func (lc *LawFirmController) CreateRole(c echo.Context) error {
	lawFirmID := c.Param("id")
	req := new(CreateRoleRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	role := &schema.LawFirmRole{
		LawFirmID:     lawFirmID,
		Name:          req.Name,
		PermRead:      req.PermRead,
		PermWrite:     req.PermWrite,
		PermManage:    req.PermManage,
		PermFirmAdmin: req.PermFirmAdmin,
	}

	if err := lc.lawFirmRepo.CreateRole(c.Request().Context(), role); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:  http.StatusCreated,
		Message: "Role created successfully",
		Data:    role,
	})
}

func (lc *LawFirmController) ListRoles(c echo.Context) error {
	lawFirmID := c.Param("id")
	lawFirm, err := lc.lawFirmRepo.GetLawFirmByID(c.Request().Context(), lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if lawFirm == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Roles retrieved successfully",
		Data:    lawFirm.Roles,
	})
}

func (lc *LawFirmController) UpdateRole(c echo.Context) error {
	roleID := c.Param("roleId")
	req := new(CreateRoleRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	role, err := lc.lawFirmRepo.GetRoleByID(c.Request().Context(), roleID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if role == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	role.Name = req.Name
	role.PermRead = req.PermRead
	role.PermWrite = req.PermWrite
	role.PermManage = req.PermManage
	role.PermFirmAdmin = req.PermFirmAdmin

	if err := lc.lawFirmRepo.UpdateRole(c.Request().Context(), role); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Role updated successfully",
		Data:    role,
	})
}

func (lc *LawFirmController) DeleteRole(c echo.Context) error {
	roleID := c.Param("roleId")
	if err := lc.lawFirmRepo.DeleteRole(c.Request().Context(), roleID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Role deleted successfully",
	})
}
