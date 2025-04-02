package database

import (
	"context"
	"log/slog"
	"time"

	"marai/internal/config"
	"marai/internal/database/schema"
	"marai/internal/utils"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB() *gorm.DB {
	dbUrl := config.GetEnv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		slog.Error("Error connecting to database", slog.String("error", err.Error()))
		return nil
	}

	sqlDB, err := db.DB()
	if err != nil {
		slog.Error("Error getting underlying *sql.DB", slog.String("error", err.Error()))
		return nil
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	slog.Info("Postgres database connection established")
	return db
}

func RunPostgresMigrations(db *gorm.DB) error {
	err := db.AutoMigrate(
		&schema.User{},
		&schema.Session{},
		&schema.LawFirm{},
		&schema.LawFirmRole{},
		&schema.LawFirmMembership{},
		&schema.Contract{},
		&schema.ContractParty{},
		&schema.SignatureEvent{},
	)
	if err != nil {
		slog.Error("Error running migrations", slog.String("error", err.Error()))
		return err
	}

	slog.Info("Postgres migrations completed successfully")
	return nil
}

func NewMinioDB() *minio.Client {
	MinioSSLPolicy := config.GetEnv("MINIO_SSL_POLICY", "false")
	SSLPolicy := MinioSSLPolicy == "true"

	client, err := minio.New(config.GetEnv("MINIO_ENDPOINT"), &minio.Options{
		Creds: credentials.NewStaticV4(
			config.GetEnv("MINIO_ACCESS_KEY"),
			config.GetEnv("MINIO_ACCESS_SECRET"),
			""),
		Secure: SSLPolicy,
		Region: "",
	})

	if err != nil {
		slog.Error("Error creating MinIO client", slog.String("error", err.Error()))
		return nil
	}

	_, err = client.ListBuckets(context.Background())
	if err != nil {
		slog.Error("Error connecting to MinIO", slog.String("error", err.Error()))
		return nil
	}

	err = InitMinioClient(client)
	if err != nil {
		slog.Error("Error initializing MinIO buckets", slog.String("error", err.Error()))
		return nil
	}

	slog.Info("MinIO client initialized successfully")
	return client
}

func InitMinioClient(client *minio.Client) error {
	ctx := context.Background()
	buckets := []string{
		config.GetEnv("MINIO_BUCKET_NAME", "marai"),
		"contracts",
	}

	for _, bucketName := range buckets {
		bucketExists, err := client.BucketExists(ctx, bucketName)
		if err != nil {
			slog.Error("Error checking if bucket exists", slog.String("bucket", bucketName), slog.String("error", err.Error()))
			return err
		}

		if !bucketExists {
			err = client.MakeBucket(
				ctx,
				bucketName,
				minio.MakeBucketOptions{
					Region:        "",
					ObjectLocking: false,
				},
			)
			if err != nil {
				slog.Error("Error creating bucket", slog.String("bucket", bucketName), slog.String("error", err.Error()))
				return err
			}

			if err = client.SetBucketPolicy(
				ctx,
				bucketName,
				utils.GetBucketPolicy(bucketName),
			); err != nil {
				slog.Error("Error setting bucket policy", slog.String("bucket", bucketName), slog.String("error", err.Error()))
				return err
			}

			err = client.SetBucketVersioning(ctx, bucketName, minio.BucketVersioningConfiguration{Status: "Enabled"})
			if err != nil {
				slog.Error("Error enabling bucket versioning", slog.String("bucket", bucketName), slog.String("error", err.Error()))
				return err
			}

			slog.Info("Bucket created and configured", slog.String("bucket", bucketName))
		} else {
			slog.Info("Bucket already exists", slog.String("bucket", bucketName))
		}
	}

	return nil
}
