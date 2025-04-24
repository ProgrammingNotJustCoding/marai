package controllers

import (
	"fmt"
	"marai/api/constants"
	"marai/internal/database/repositories"
	"marai/internal/database/schema"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/oklog/ulid/v2"
	"golang.org/x/crypto/bcrypt"
)

type UpdateLawFirmRequest struct {
	Name             string `json:"name"`
	Address          string `json:"address"`
	Mobile           string `json:"mobile"`
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

type AddMemberRequest struct {
	RoleID string `json:"roleId,omitempty" validate:"required"`

	MemberName      string `json:"memberName,omitempty" validate:"required"`
	MemberEmail     string `json:"memberEmail,omitempty" validate:"required"`
	MemberPhone     string `json:"memberPhone,omitempty" validate:"required"`
	MemberImageUrl  string `json:"memberImage,omitempty"`
	MemberBannerUrl string `json:"memberBanner,omitempty"`
}

type UpdateMemberRequest struct {
	RoleID string `json:"roleId,omitempty" validate:"required"`
}

type RoleAdminRequest struct {
	RoleID string `json:"roleId" validate:"required"`
}

type LawFirmController struct {
	lawFirmRepo *repositories.LawFirmRepo
	userRepo    *repositories.UserRepo
}

func NewLawFirmController(lawFirmRepo *repositories.LawFirmRepo, userRepo *repositories.UserRepo) *LawFirmController {
	return &LawFirmController{
		lawFirmRepo: lawFirmRepo,
		userRepo:    userRepo,
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
	if req.Mobile != "" {
		lawFirm.Mobile = req.Mobile
	}
	if req.Email != "" {
		lawFirm.Email = req.Email
	}

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

func (lc *LawFirmController) updateRoleAdminStatus(c echo.Context, promote bool) error {
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

	role.PermFirmAdmin = promote
	if err := lc.lawFirmRepo.UpdateRole(c.Request().Context(), role); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	message := "Role demoted from admin successfully"
	prettyMessage := "The role no longer has admin permissions"
	if promote {
		message = "Role promoted to admin successfully"
		prettyMessage = "The role has been promoted to admin"
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:        http.StatusOK,
		Message:       message,
		PrettyMessage: prettyMessage,
		Data:          role,
	})
}

func (lc *LawFirmController) HandlePromoteRoleToAdmin(c echo.Context) error {
	return lc.updateRoleAdminStatus(c, true)
}

func (lc *LawFirmController) HandleDemoteRoleFromAdmin(c echo.Context) error {
	return lc.updateRoleAdminStatus(c, false)
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

	isMember, err := mc.lawFirmRepo.IsMember(c.Request().Context(), req.MemberEmail, lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if isMember {
		return c.JSON(http.StatusConflict, constants.ErrConflict)
	}

	password := "password"
	fmt.Println("password: ", password)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	fmt.Println("hashedPassword: ", hashedPassword)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	member := &schema.LawFirmMember{
		LawFirmID:   lawFirmID,
		RoleID:      req.RoleID,
		MemberName:  req.MemberName,
		MemberEmail: req.MemberEmail,
		MemberPhone: req.MemberPhone,
		MemberHash:  string(hashedPassword),
	}

	if err := mc.lawFirmRepo.CreateMember(c.Request().Context(), member); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:  http.StatusCreated,
		Message: "Member added successfully",
		Data: map[string]interface{}{
			"email":    member.MemberEmail,
			"password": password,
		},
	})
}

func (mc *LawFirmController) HandleListMembers(c echo.Context) error {
	lawFirmID := c.Param("id")
	members, err := mc.lawFirmRepo.GetMembersByLawFirmID(c.Request().Context(), lawFirmID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Members retrieved successfully",
		Data:    members,
	})
}

func (mc *LawFirmController) HandleUpdateMember(c echo.Context) error {
	memberID := c.Param("memberId")
	req := new(UpdateMemberRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	member, err := mc.lawFirmRepo.GetMemberByID(c.Request().Context(), memberID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if member == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	member.RoleID = req.RoleID

	if err := mc.lawFirmRepo.UpdateMember(c.Request().Context(), member); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Member updated successfully",
		Data:    member,
	})
}

func (mc *LawFirmController) HandleRemoveMember(c echo.Context) error {
	memberID := c.Param("memberId")
	if err := mc.lawFirmRepo.DeleteMember(c.Request().Context(), memberID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Member removed successfully",
	})
}

func (lc *LawFirmController) HandleResetMemberPassword(c echo.Context) error {
	lawFirmID := c.Param("id")
	if lawFirmID == "" {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	type ResetMemberPasswordRequest struct {
		MemberID string `json:"memberId" validate:"required"`
	}
	req := new(ResetMemberPasswordRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	member, err := lc.lawFirmRepo.GetMemberByID(c.Request().Context(), req.MemberID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if member == nil {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if member.LawFirmID != lawFirmID {
		return c.JSON(http.StatusForbidden, constants.ErrForbidden)
	}

	newPassword := ulid.Make().String()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		c.Logger().Error("Failed to hash password:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	member.MemberHash = string(hashedPassword)
	member.UpdatedAt = time.Now()

	if err := lc.lawFirmRepo.UpdateMember(c.Request().Context(), member); err != nil {
		c.Logger().Error("Failed to update member:", err)
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":  http.StatusOK,
		"message": "Member password reset successfully",
		"data": map[string]interface{}{
			"memberId":    member.ID,
			"memberEmail": member.MemberEmail,
			"password":    newPassword,
			"note":        "Please provide this password to the member",
		},
	})
}
