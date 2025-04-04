package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"io"
)

func EncryptData(data []byte, keyString string) ([]byte, error) {
	key := deriveKey(keyString, 32)

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}

	ciphertext := gcm.Seal(nonce, nonce, data, nil)

	return ciphertext, nil
}

func DecryptData(encryptedData []byte, keyString string) ([]byte, error) {
	key := deriveKey(keyString, 32)

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := gcm.NonceSize()
	if len(encryptedData) < nonceSize {
		return nil, errors.New("ciphertext too short")
	}

	nonce, ciphertext := encryptedData[:nonceSize], encryptedData[nonceSize:]

	return gcm.Open(nil, nonce, ciphertext, nil)
}

func deriveKey(keyString string, keyLength int) []byte {
	hash := sha256.Sum256([]byte(keyString))
	return hash[:keyLength]
}

func ExtractPublicKeyFromPrivateKey(privateKeyPEM string) (string, error) {
	block, _ := pem.Decode([]byte(privateKeyPEM))
	if block == nil {
		return "", fmt.Errorf("failed to parse PEM block containing private key")
	}

	var privateKey interface{}
	var err error

	switch block.Type {
	case "RSA PRIVATE KEY":
		privateKey, err = x509.ParsePKCS1PrivateKey(block.Bytes)
	case "PRIVATE KEY":
		privateKey, err = x509.ParsePKCS8PrivateKey(block.Bytes)
	default:
		return "", fmt.Errorf("unsupported private key type: %s", block.Type)
	}

	if err != nil {
		return "", fmt.Errorf("failed to parse private key: %v", err)
	}

	var publicKeyBytes []byte

	switch k := privateKey.(type) {
	case *rsa.PrivateKey:
		publicKeyBytes, err = x509.MarshalPKIXPublicKey(&k.PublicKey)
	default:
		return "", fmt.Errorf("unsupported private key format")
	}

	if err != nil {
		return "", fmt.Errorf("failed to marshal public key: %v", err)
	}

	publicPEM := &pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyBytes,
	}

	var publicKeyPEM bytes.Buffer
	if err := pem.Encode(&publicKeyPEM, publicPEM); err != nil {
		return "", fmt.Errorf("failed to encode public key to PEM: %v", err)
	}

	return publicKeyPEM.String(), nil
}
