// internal/config/config.go
package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	DatabaseURL   string
	JWTSecret     string
	JWTExpiresIn  time.Duration
	Port          string
	GinMode       string
}

func Load() *Config {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "root@1289")
	dbName := getEnv("DB_NAME", "wa_database")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	databaseURL := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode,
	)

	jwtExpiresIn, err := time.ParseDuration(getEnv("JWT_EXPIRES_IN", "24h"))
	if err != nil {
		jwtExpiresIn = 24 * time.Hour
	}

	return &Config{
		DatabaseURL:   databaseURL,
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiresIn:  jwtExpiresIn,
		Port:          getEnv("PORT", "8080"),
		GinMode:       getEnv("GIN_MODE", "debug"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}