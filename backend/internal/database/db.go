package database

import (
	"log"
	"marai/internal/config"
	"marai/internal/database/schema"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB() (*gorm.DB, error) {
	env := config.LoadEnv()
	dbUrl := env.DBUrl

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Error getting underlying *sql.DB: %v", err)
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)

	sqlDB.SetMaxOpenConns(100)

	sqlDB.SetConnMaxLifetime(time.Hour)

	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	return db, nil
}

func RunMigrations(db *gorm.DB) error {
	return db.AutoMigrate(
		&schema.User{},
	)
}
