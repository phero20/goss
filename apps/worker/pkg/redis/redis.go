package redis

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var Client *redis.Client
var Ctx = context.Background()

func ConnectRedis() {
	addr := fmt.Sprintf("%s:%s",
		os.Getenv("REDIS_HOST"),
		os.Getenv("REDIS_PORT"),
	)

	Client = redis.NewClient(&redis.Options{
		Addr: addr,
	})

	_, err := Client.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("❌ Redis connection failed:", err)
	}

	log.Println("✅ Connected to Redis")
}
