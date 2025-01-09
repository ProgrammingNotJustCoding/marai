package config

import (
	"log"

	"github.com/spf13/viper"
)

type Env struct {
	Port string `mapstructure:"PORT"`
}

func LoadEnv() *Env {
	env := Env{}

	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	viper.SetDefault("PORT", "8000")

	err := viper.ReadInConfig()
	if err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("No .env file found, using defaults and environment variables")
		} else {
			log.Fatalf("Error reading .env file: %s\n", err)
		}
	}

	err = viper.Unmarshal(&env)
	if err != nil {
		log.Fatalf("Unable to decode into struct, %v", err)
	}

	log.Printf("Environment variables loaded successfully!")
	return &env
}
