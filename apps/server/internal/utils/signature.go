package utils

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
)

func GenerateSignatureKeyPair() (privateKeyPEM string, publicKeyPEM string, err error) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return "", "", err
	}

	x509PrivateKey, err := x509.MarshalECPrivateKey(privateKey)
	if err != nil {
		return "", "", err
	}
	privateKeyPEM = string(pem.EncodeToMemory(&pem.Block{
		Type:  "EC PRIVATE KEY",
		Bytes: x509PrivateKey,
	}))

	x509PublicKey, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return "", "", err
	}
	publicKeyPEM = string(pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: x509PublicKey,
	}))

	return privateKeyPEM, publicKeyPEM, nil
}

func SignData(privateKeyPEM string, data []byte) (string, error) {
	block, _ := pem.Decode([]byte(privateKeyPEM))
	if block == nil {
		return "", errors.New("failed to parse PEM block containing the private key")
	}

	privateKey, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		return "", err
	}

	hash := sha256.Sum256(data)

	r, s, err := ecdsa.Sign(rand.Reader, privateKey, hash[:])
	if err != nil {
		return "", err
	}

	signature := append(r.Bytes(), s.Bytes()...)
	signatureBase64 := base64.StdEncoding.EncodeToString(signature)

	return signatureBase64, nil
}

func VerifySignature(publicKeyPEM string, data []byte, signatureBase64 string) (bool, error) {
	block, _ := pem.Decode([]byte(publicKeyPEM))
	if block == nil {
		return false, errors.New("failed to parse PEM block containing the public key")
	}

	publicKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return false, err
	}

	publicKey, ok := publicKeyInterface.(*ecdsa.PublicKey)
	if !ok {
		return false, errors.New("not an ECDSA public key")
	}

	signature, err := base64.StdEncoding.DecodeString(signatureBase64)
	if err != nil {
		return false, err
	}

	if len(signature) != 64 {
		return false, fmt.Errorf("invalid signature length: %d", len(signature))
	}
	r := new(big.Int).SetBytes(signature[:32])
	s := new(big.Int).SetBytes(signature[32:])

	hash := sha256.Sum256(data)

	return ecdsa.Verify(publicKey, hash[:], r, s), nil
}

func HashFile(data []byte) string {
	hash := sha256.New()
	hash.Write(data)
	return fmt.Sprintf("%x", hash.Sum(nil))
}
