package resume

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ResumeRequest struct {
	DataJSON   string `json:"data_json"`
	TemplateID string `json:"template_id"`
	IsPublic   bool   `json:"is_public"`
	Slug       string `json:"slug"`
}

func SaveResumeHandler(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req ResumeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// 1. Check if resume exists for this user
	existingResume, err := GetByUserID(userID)
	if err == nil && existingResume.ID != 0 {
		// UPDATE existing
		existingResume.DataJSON = req.DataJSON
		existingResume.TemplateID = req.TemplateID
		existingResume.IsPublic = req.IsPublic

		// Only update slug if provided and different, else keep existing or generate if completely missing
		if req.Slug != "" {
			existingResume.Slug = req.Slug
		}

		if err := CreateOrUpdate(existingResume); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update resume"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Resume updated"})
	} else {
		// CREATE new
		// Generate slug if missing
		slug := req.Slug
		if slug == "" {
			slug = fmt.Sprintf("user-%d-%d", userID, time.Now().Unix())
		}

		r := &Resume{
			UserID:     userID,
			DataJSON:   req.DataJSON,
			TemplateID: req.TemplateID,
			IsPublic:   req.IsPublic,
			Slug:       slug,
		}

		if err := CreateOrUpdate(r); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Resume created"})
	}
}

func GetMyResumeHandler(c *gin.Context) {
	userID := c.GetUint("user_id")

	resume, err := GetMyResume(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resume not found"})
		return
	}

	c.JSON(http.StatusOK, resume)
}

func GetPublicResumeHandler(c *gin.Context) {
	slug := c.Param("slug")

	resume, err := GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
		return
	}

	c.JSON(http.StatusOK, resume)
}
