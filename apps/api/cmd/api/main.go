package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"resume-api/internal/auth"
	"resume-api/internal/middleware"
	"resume-api/internal/resume"
	"resume-api/internal/user"
	"resume-api/pkg/db"
)

func main() {
	_ = godotenv.Load("../../.env")

	db.ConnectPostgres()

	// ✅ Auto-Migrate Tables
	if err := db.DB.AutoMigrate(&user.User{}, &resume.Resume{}); err != nil {
		log.Fatal("❌ Migration failed:", err)
	}
	log.Println("✅ Tables migrated")

	r := gin.Default()

	// CORS Configuration (Allow All)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Auth
	r.POST("/auth/register", auth.RegisterHandler)
	r.POST("/auth/login", auth.LoginHandler)

	// Protected routes
	authGroup := r.Group("/")
	authGroup.Use(middleware.AuthMiddleware())
	{
		authGroup.GET("/auth/verify-token", auth.VerifyTokenHandler)
		authGroup.POST("/resume", resume.SaveResumeHandler)
		authGroup.GET("/resume", resume.GetMyResumeHandler)
	}

	// Public routes
	r.GET("/portfolio/:slug", resume.GetPublicResumeHandler)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "API running with Resume APIs"})
	})

	r.Run(":8080")
}
