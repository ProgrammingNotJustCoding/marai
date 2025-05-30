package controllers

import (
	"bytes"
	"io"
	"marai/api/constants"
	"marai/internal/config"
	"marai/internal/database/repositories"
	"marai/internal/utils"
	"net/http"

	echo "github.com/labstack/echo/v4"
	"github.com/minio/minio-go/v7"
)

type PublicKeyRequest struct {
	Key string `json:"key" validate:"required"`
}

type KeysController struct {
	userRepo    *repositories.UserRepo
	minioClient *minio.Client
	bucketName  string
}

func NewKeysController(userRepo *repositories.UserRepo, minioClient *minio.Client) *KeysController {
	if minioClient == nil {
		panic("MinIO client is not initialized")
	}

	bucketName := config.GetEnv("MINIO_BUCKET_NAME", "marai")
	return &KeysController{
		userRepo:    userRepo,
		minioClient: minioClient,
		bucketName:  bucketName,
	}
}

func (kc *KeysController) HandleAddPublicKey(c echo.Context) error {
	userID := c.Get("userID").(string)
	req := new(PublicKeyRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	PublicKeyID, err := kc.userRepo.AddPublicKey(c.Request().Context(), userID, req.Key)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:  http.StatusCreated,
		Message: "Public key added successfully",
		Data: map[string]string{
			"keyId": PublicKeyID,
		},
	})
}

func (kc *KeysController) HandleGenerateKeyPair(c echo.Context) error {
	userID := c.Get("userID").(string)

	privateKey, publicKeyPEM, err := utils.GenerateKeyPair(2048)
	if err != nil {
		c.Logger().Error("Error generating key pair: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Key Generation Failed",
			PrettyMessage: "There was an error generating your key pair",
		})
	}

	keyID, err := kc.userRepo.AddPublicKey(c.Request().Context(), userID, publicKeyPEM)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	objectName := generatePrivateKeyObjectName(userID, keyID)
	privateKeyBytes := []byte(privateKey)

	reader := bytes.NewReader(privateKeyBytes)

	opts := minio.PutObjectOptions{ContentType: "application/x-pem-file"}

	_, err = kc.minioClient.PutObject(
		c.Request().Context(),
		kc.bucketName,
		objectName,
		reader,
		int64(len(privateKeyBytes)),
		opts,
	)
	if err != nil {
		c.Logger().Error("Error storing private key: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Key Storage Failed",
			PrettyMessage: "There was an error storing your private key",
		})
	}

	return c.JSON(http.StatusCreated, constants.Response{
		Status:        http.StatusCreated,
		Message:       "Key pair generated successfully",
		PrettyMessage: "Your key pair has been generated successfully",
		Data: map[string]string{
			"keyId":       keyID,
			"downloadUrl": "/api/auth/user/me/keys/download/" + keyID,
		},
	})
}

func (kc *KeysController) HandleDownloadPrivateKey(c echo.Context) error {
	userID := c.Get("userID").(string)
	keyID := c.Param("keyId")

	exists, err := kc.userRepo.UserOwnsKey(c.Request().Context(), userID, keyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !exists {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	objectName := generatePrivateKeyObjectName(userID, keyID)

	opts := minio.GetObjectOptions{}

	obj, err := kc.minioClient.GetObject(c.Request().Context(), kc.bucketName, objectName, opts)
	if err != nil {
		c.Logger().Error("Error retrieving private key: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Key Retrieval Failed",
			PrettyMessage: "There was an error retrieving your private key",
		})
	}
	defer func() {
		if err := obj.Close(); err != nil {
			c.Logger().Error("Error closing object: ", err)
		}
	}()

	privateKeyBytes, err := io.ReadAll(obj)
	if err != nil {
		c.Logger().Error("Error reading private key data: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Key Read Failed",
			PrettyMessage: "There was an error reading your private key",
		})
	}

	go func() {
		removeOpts := minio.RemoveObjectOptions{}

		if err := kc.minioClient.RemoveObject(c.Request().Context(), kc.bucketName, objectName, removeOpts); err != nil {
			c.Logger().Error("Failed to delete private key after download: ", err)
		}
	}()

	c.Response().Header().Set("Content-Disposition", "attachment; filename=private_key.pem")
	c.Response().Header().Set("Content-Type", "application/x-pem-file")

	return c.Blob(http.StatusOK, "application/x-pem-file", privateKeyBytes)
}

func (kc *KeysController) HandleListPublicKeys(c echo.Context) error {
	userID := c.Get("userID").(string)

	keys, err := kc.userRepo.GetPublicKeys(c.Request().Context(), userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Public keys retrieved successfully",
		Data:    keys,
	})
}

func (kc *KeysController) HandleUpdateKey(c echo.Context) error {
	userID := c.Get("userID").(string)
	keyID := c.Param("keyID")

	type KeyUpdateRequest struct {
		Name string `json:"name" validate:"required"`
	}

	var req KeyUpdateRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, constants.ErrBadRequest)
	}

	exists, err := kc.userRepo.UserOwnsKey(c.Request().Context(), userID, keyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !exists {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if err := kc.userRepo.UpdateKeyName(c.Request().Context(), keyID, req.Name); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Key updated successfully",
	})
}

func (kc *KeysController) HandleDeleteKey(c echo.Context) error {
	userID := c.Get("userID").(string)
	keyID := c.Param("keyID")

	exists, err := kc.userRepo.UserOwnsKey(c.Request().Context(), userID, keyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !exists {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	if err := kc.userRepo.DeleteKey(c.Request().Context(), keyID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Key deleted successfully",
	})
}

func (kc *KeysController) HandleDownloadKey(c echo.Context) error {
	userID := c.Get("userID").(string)
	keyID := c.Param("keyID")

	exists, err := kc.userRepo.UserOwnsKey(c.Request().Context(), userID, keyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if !exists {
		return c.JSON(http.StatusNotFound, constants.ErrNotFound)
	}

	key, err := kc.userRepo.GetKeyByID(c.Request().Context(), keyID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}
	if key.HasDownloaded {
		return c.JSON(http.StatusBadRequest, constants.Error{
			Status:        http.StatusBadRequest,
			Message:       "Key already downloaded",
			PrettyMessage: "This key has already been downloaded",
		})
	}

	if err := kc.userRepo.MarkKeyAsDownloaded(c.Request().Context(), keyID); err != nil {
		return c.JSON(http.StatusInternalServerError, constants.ErrInternalServer)
	}

	return c.JSON(http.StatusOK, constants.Response{
		Status:  http.StatusOK,
		Message: "Key downloaded successfully",
		Data: map[string]string{
			"key": key.Key,
		},
	})
}

func generatePrivateKeyObjectName(userID, keyID string) string {
	return "private_keys/" + userID + "/" + keyID + ".pem"
}
