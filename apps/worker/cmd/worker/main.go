package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"resume-worker/pkg/redis"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Println("⚠️ No .env file found")
	}

	redis.ConnectRedis()

	log.Println("🚀 Worker is running and connected to Redis")
	// Wait for termination signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down worker...")
}
