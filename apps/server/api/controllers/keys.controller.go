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

	// Create reader from bytes
	reader := bytes.NewReader(privateKeyBytes)

	// Create PutObject options
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

	// Create GetObject options
	opts := minio.GetObjectOptions{}

	// Get object
	obj, err := kc.minioClient.GetObject(c.Request().Context(), kc.bucketName, objectName, opts)
	if err != nil {
		c.Logger().Error("Error retrieving private key: ", err)
		return c.JSON(http.StatusInternalServerError, constants.Error{
			Status:        http.StatusInternalServerError,
			Message:       "Key Retrieval Failed",
			PrettyMessage: "There was an error retrieving your private key",
		})
	}
	defer obj.Close()

	// Read object content
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
		// Create RemoveObject options
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

func generatePrivateKeyObjectName(userID, keyID string) string {
	return "private_keys/" + userID + "/" + keyID + ".pem"
}
