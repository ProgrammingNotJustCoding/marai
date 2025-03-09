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
	Name             string `json:"name" validate:"required"`
	Address          string `json:"address"`
	Phone            string `json:"phone"`
	Email            string `json:"email" validate:"required,email"`
	PublicContact    string `json:"publicContact"`
	PublicAddress    string `json:"publicAddress"`
	PublicImageUrl   string `json:"publicImageUrl"`
	PublicBannerUrl  string `json:"publicBannerUrl"`
	PublicWebsiteUrl string `json:"publicWebsiteUrl"`
	PublicSocials1   string `json:"publicSocials1"`
	PublicSocials2   string `json:"publicSocials2"`
	PublicSocials3   string `json:"publicSocials3"`
	PublicSocials4   string `json:"publicSocials4"`
}

type UpdateLawFirmRequest struct {
	Name             string `json:"name"`
	Address          string `json:"address"`
	Phone            string `json:"phone"`
	Email            string `json:"email" validate:"email"`
	PublicContact    string `json:"publicContact"`
	PublicAddress    string `json:"publicAddress"`
	PublicImageUrl   string `json:"publicImageUrl"`
	PublicBannerUrl  string `json:"publicBannerUrl"`
	PublicWebsiteUrl string `json:"publicWebsiteUrl"`
	PublicSocials1   string `json:"publicSocials1"`
	PublicSocials2   string `json:"publicSocials2"`
	PublicSocials3   string `json:"publicSocials3"`
	PublicSocials4   string `json:"publicSocials4"`
}

type CreateRoleRequest struct {
	Name          string `json:"name" validate:"required"`
	LawFirmID     string `json:"lawFirmId" validate:"required"`
	PermRead      bool   `json:"permRead"`
	PermWrite     bool   `json:"permWrite"`
	PermManage    bool   `json:"permManage"`
	PermFirmAdmin bool   `json:"permFirmAdmin"`
}

type RoleAdminRequest struct {
	RoleID string `json:"roleId" validate:"required"`
}

type LawFirmController struct {
	lawFirmRepo *repositories.LawFirmRepo
}

type AddMemberRequest struct {
	UserID string `json:"userId,omitempty" validate:"required"`
	RoleID string `json:"roleId,omitempty" validate:"required"`
}

type UpdateMemberRequest struct {
	RoleID string `json:"roleId,omitempty" validate:"required"`
}

func NewLawFirmController(lawFirmRepo *repositories.LawFirmRepo) *LawFirmController {
	return &LawFirmController{
		lawFirmRepo: lawFirmRepo,
	}
}

func (lc *LawFirmController) HandleGetAllLawFirms(c echo.Context) error {
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

func (lc *LawFirmController) HandleCreateLawFirm(c echo.Context) error {
	req := new(CreateLawFirmRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	userID := c.Get("userID").(string)
	lawFirm := &schema.LawFirm{
		Name:             req.Name,
		Address:          req.Address,
		Phone:            req.Phone,
		Email:            req.Email,
		OwnerID:          userID,
		PublicContact:    req.PublicContact,
		PublicAddress:    req.PublicAddress,
		PublicImageUrl:   req.PublicImageUrl,
		PublicBannerUrl:  req.PublicBannerUrl,
		PublicWebsiteUrl: req.PublicWebsiteUrl,
		PublicSocials1:   req.PublicSocials1,
		PublicSocials2:   req.PublicSocials2,
		PublicSocials3:   req.PublicSocials3,
		PublicSocials4:   req.PublicSocials4,
	}

	if err := lc.lawFirmRepo.CreateLawFirm(c.Request().Context(), lawFirm); err != nil {
		if strings.Contains(err.Error(), "ERROR: duplicate key value violates unique constraint \"uni_law_firms_email\"") {
			return c.JSON(http.StatusConflict, constants.ErrDuplicateEmail)
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

func (lc *LawFirmController) HandleGetLawFirm(c echo.Context) error {
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

func (lc *LawFirmController) HandleListLawFirms(c echo.Context) error {
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

func (lc *LawFirmController) HandleUpdateLawFirm(c echo.Context) error {
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

	// Update the new fields
	if req.PublicContact != "" {
		lawFirm.PublicContact = req.PublicContact
	}
	if req.PublicAddress != "" {
		lawFirm.PublicAddress = req.PublicAddress
	}
	if req.PublicImageUrl != "" {
		lawFirm.PublicImageUrl = req.PublicImageUrl
	}
	if req.PublicBannerUrl != "" {
		lawFirm.PublicBannerUrl = req.PublicBannerUrl
	}
	if req.PublicWebsiteUrl != "" {
		lawFirm.PublicWebsiteUrl = req.PublicWebsiteUrl
	}
	if req.PublicSocials1 != "" {
		lawFirm.PublicSocials1 = req.PublicSocials1
	}
	if req.PublicSocials2 != "" {
		lawFirm.PublicSocials2 = req.PublicSocials2
	}
	if req.PublicSocials3 != "" {
		lawFirm.PublicSocials3 = req.PublicSocials3
	}
	if req.PublicSocials4 != "" {
		lawFirm.PublicSocials4 = req.PublicSocials4
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

func (lc *LawFirmController) HandleDeleteLawFirm(c echo.Context) error {
	id := c.Param("id")
	if err := lc.lawFirmRepo.DeleteLawFirm(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Law firm deleted successfully",
	})
}

func (lc *LawFirmController) HandleCreateRole(c echo.Context) error {
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

func (lc *LawFirmController) HandlePromoteRoleToAdmin(c echo.Context) error {
	lawFirmID := c.Param("id")
	req := new(RoleAdminRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	role, err := lc.lawFirmRepo.GetRoleByID(c.Request().Context(), req.RoleID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if role == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if role.LawFirmID != lawFirmID {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        400,
			Message:       "Bad Request",
			PrettyMessage: "The role does not belong to this law firm",
		})
	}

	role.PermFirmAdmin = true
	if err := lc.lawFirmRepo.UpdateRole(c.Request().Context(), role); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Role promoted to admin successfully",
		PrettyMessage: "The role has been promoted to admin",
		Data:          role,
	})
}

func (lc *LawFirmController) HandleDemoteRoleFromAdmin(c echo.Context) error {
	lawFirmID := c.Param("id")
	req := new(RoleAdminRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	role, err := lc.lawFirmRepo.GetRoleByID(c.Request().Context(), req.RoleID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if role == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if role.LawFirmID != lawFirmID {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        400,
			Message:       "Bad Request",
			PrettyMessage: "The role does not belong to this law firm",
		})
	}

	role.PermFirmAdmin = false
	if err := lc.lawFirmRepo.UpdateRole(c.Request().Context(), role); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       "Role demoted from admin successfully",
		PrettyMessage: "The role no longer has admin permissions",
		Data:          role,
	})
}

func (lc *LawFirmController) HandleListRoles(c echo.Context) error {
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

func (lc *LawFirmController) HandleUpdateRole(c echo.Context) error {
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

func (lc *LawFirmController) HandleDeleteRole(c echo.Context) error {
	roleID := c.Param("roleId")
	c.Logger().Warn("Deleting role", roleID)
	if err := lc.lawFirmRepo.DeleteRole(c.Request().Context(), roleID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Role deleted successfully",
	})
}

func (mc *LawFirmController) HandleAddMember(c echo.Context) error {
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

func (mc *LawFirmController) HandleListMembers(c echo.Context) error {
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

func (mc *LawFirmController) HandleUpdateMember(c echo.Context) error {
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

func (mc *LawFirmController) HandleRemoveMember(c echo.Context) error {
	membershipID := c.Param("memberId")
	if err := mc.lawFirmRepo.DeleteMembership(c.Request().Context(), membershipID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Member removed successfully",
	})
}
