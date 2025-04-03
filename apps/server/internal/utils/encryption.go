package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"errors"
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
