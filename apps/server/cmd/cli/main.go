package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"marai/internal/utils"
	"os"
	"path/filepath"
	"strings"
)

const (
	configFileName = ".marai-config.json"
)

type Config struct {
	PrivateKeyPath string `json:"privateKeyPath"`
	APIBaseURL     string `json:"apiBaseURL"`
	SessionID      string `json:"sessionId,omitempty"`
}

func main() {
	generateKeyCmd := flag.NewFlagSet("generate-key", flag.ExitOnError)
	generateKeyOutput := generateKeyCmd.String("output", "marai_key", "Base name for output key files (without extension)")

	signCmd := flag.NewFlagSet("sign", flag.ExitOnError)
	signHash := signCmd.String("hash", "", "Hash to sign")
	signKeyPath := signCmd.String("key", "", "Path to private key (default from config)")

	configCmd := flag.NewFlagSet("config", flag.ExitOnError)
	configAPIURL := configCmd.String("api-url", "http://localhost:8000/api", "Base URL for API")
	configKeyPath := configCmd.String("key-path", "", "Path to private key file")

	extractPublicCmd := flag.NewFlagSet("extract-public", flag.ExitOnError)
	extractPrivateKeyPath := extractPublicCmd.String("key", "", "Path to private key file")

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "generate-key":
		if err := generateKeyCmd.Parse(os.Args[2:]); err != nil {
			log.Fatalf("Error parsing generate-key flags: %v", err)
		}
		handleGenerateKey(*generateKeyOutput)
	case "sign":
		if err := signCmd.Parse(os.Args[2:]); err != nil {
			log.Fatalf("Error parsing sign flags: %v", err)
		}
		if *signHash == "" {
			fmt.Println("Error: -hash flag is required")
			signCmd.PrintDefaults()
			os.Exit(1)
		}
		handleSign(*signHash, *signKeyPath)
	case "config":
		if err := configCmd.Parse(os.Args[2:]); err != nil {
			log.Fatalf("Error parsing config flags: %v", err)
		}
		handleConfig(*configAPIURL, *configKeyPath)
	case "extract-public":
		if err := extractPublicCmd.Parse(os.Args[2:]); err != nil {
			log.Fatalf("Error parsing extract-public flags: %v", err)
		}
		handleExtractPublic(*extractPrivateKeyPath)
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Marai CLI - Contract Signing Tool")
	fmt.Println("\nUsage:")
	fmt.Println("  marai-cli [command] [options]")
	fmt.Println("\nCommands:")
	fmt.Println("  generate-key    Generate a new public/private key pair")
	fmt.Println("  sign            Sign a hash using your private key")
	fmt.Println("  config          Configure CLI settings")
	fmt.Println("  extract-public   Extract and display public key from a private key")
	fmt.Println("  help            Show this help message")
	fmt.Println("\nRun 'marai-cli [command] -h' for more information on a command.")
}

func loadConfig() (Config, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return Config{}, err
	}

	configPath := filepath.Join(homeDir, configFileName)
	config := Config{
		APIBaseURL: "http://localhost:8000/api",
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return config, nil
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return config, err
	}

	if err := json.Unmarshal(data, &config); err != nil {
		return config, err
	}

	return config, nil
}

func saveConfig(config Config) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	configPath := filepath.Join(homeDir, configFileName)
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(configPath, data, 0o600)
}

func handleGenerateKey(outputName string) {
	fmt.Println("Generating RSA key pair...")

	privateKey, publicKey, err := utils.GenerateKeyPair(2048)
	if err != nil {
		log.Fatalf("Error generating key pair: %v", err)
	}

	privateKeyPath := outputName + "_private.pem"
	if err := os.WriteFile(privateKeyPath, []byte(privateKey), 0o600); err != nil {
		log.Fatalf("Error saving private key: %v", err)
	}

	publicKeyPath := outputName + "_public.pem"
	if err := os.WriteFile(publicKeyPath, []byte(publicKey), 0o644); err != nil {
		log.Fatalf("Error saving public key: %v", err)
	}

	fmt.Printf("Key pair generated successfully:\n")
	fmt.Printf("  Private key: %s\n", privateKeyPath)
	fmt.Printf("  Public key: %s\n", publicKeyPath)
	fmt.Println("\nIMPORTANT: Keep your private key secure and back it up!")

	config, err := loadConfig()
	if err != nil {
		fmt.Printf("Warning: Could not load config: %v\n", err)
	} else {
		absPath, err := filepath.Abs(privateKeyPath)
		if err == nil {
			config.PrivateKeyPath = absPath
			if err := saveConfig(config); err != nil {
				fmt.Printf("Warning: Could not save config: %v\n", err)
			} else {
				fmt.Println("Configuration updated with new key path.")
			}
		}
	}
}

func handleSign(fileHash, keyPath string) {
	config, err := loadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if keyPath == "" {
		keyPath = config.PrivateKeyPath
		if keyPath == "" {
			log.Fatalf("No private key specified. Use -key flag or set one in config.")
		}
	}

	privateKeyBytes, err := os.ReadFile(keyPath)
	if err != nil {
		log.Fatalf("Error reading private key: %v", err)
	}
	privateKey := string(privateKeyBytes)

	signature, err := utils.SignData(privateKey, []byte(fileHash))
	if err != nil {
		log.Fatalf("Error signing hash: %v", err)
	}

	fmt.Println("\nSignature (base64):")
	fmt.Println(signature)

	fmt.Println("\nTo sign a contract, copy this signature and paste it in the signature field of the contract signing form.")
}

func handleConfig(apiURL, keyPath string) {
	config, err := loadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	if apiURL != "" {
		config.APIBaseURL = apiURL
	}

	if keyPath != "" {
		absPath, err := filepath.Abs(keyPath)
		if err != nil {
			log.Fatalf("Error getting absolute path: %v", err)
		}
		config.PrivateKeyPath = absPath
	}

	if err := saveConfig(config); err != nil {
		log.Fatalf("Error saving config: %v", err)
	}

	fmt.Println("Configuration updated successfully:")
	fmt.Printf("  API URL: %s\n", config.APIBaseURL)
	fmt.Printf("  Private key path: %s\n", config.PrivateKeyPath)
}

func handleExtractPublic(keyPath string) {
	if keyPath == "" {
		config, err := loadConfig()
		if err != nil {
			log.Fatalf("Error loading config: %v", err)
		}

		keyPath = config.PrivateKeyPath
		if keyPath == "" {
			log.Fatalf("No private key specified. Use -key flag or set one in config.")
		}
	}

	privateKeyBytes, err := os.ReadFile(keyPath)
	if err != nil {
		log.Fatalf("Error reading private key: %v", err)
	}

	publicKey, err := utils.ExtractPublicKeyFromPrivateKey(string(privateKeyBytes))
	if err != nil {
		log.Fatalf("Error extracting public key: %v", err)
	}

	fmt.Println("Public Key (PEM format):")
	fmt.Println(publicKey)

	basePath := strings.TrimSuffix(keyPath, ".pem")
	basePath = strings.TrimSuffix(basePath, "_private")
	publicKeyPath := basePath + "_public.pem"

	if err := os.WriteFile(publicKeyPath, []byte(publicKey), 0o644); err != nil {
		log.Fatalf("Error saving public key: %v", err)
	}

	fmt.Printf("\nPublic key saved to: %s\n", publicKeyPath)
	fmt.Println("\nYou can now manually register this public key with the Marai server.")
}
