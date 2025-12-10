package resume

import (
	"net/http"

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

	r := &Resume{
		UserID:     userID,
		DataJSON:   req.DataJSON,
		TemplateID: req.TemplateID,
		IsPublic:   req.IsPublic,
		Slug:       req.Slug,
	}

	err := CreateOrUpdate(r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save resume"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resume saved"})
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
