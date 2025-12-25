package upload

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetPresignedURLHandler generates a URL that the frontend can use to upload a file directly
// In a real production scenario with S3, this would use the AWS SDK to sign a PUT URL
func GetPresignedURLHandler(c *gin.Context) {
	// 1. Generate a unique key for the file
	fileExt := c.Query("ext") // e.g., ".jpg"
	if fileExt == "" {
		fileExt = ".jpg" // default
	}
	if !strings.HasPrefix(fileExt, ".") {
		fileExt = "." + fileExt
	}

	key := fmt.Sprintf("%s%s", uuid.New().String(), fileExt)

	// 2. Construct the localized "presigned" URL
	// For local dev, this points to our own PUT endpoint
	// host := "http://localhost:8080"
	host := "http://" + c.Request.Host // Dynamic host

	uploadURL := fmt.Sprintf("%s/storage/upload?key=%s", host, key)
	publicURL := fmt.Sprintf("%s/storage/%s", host, key)

	c.JSON(http.StatusOK, gin.H{
		"uploadUrl": uploadURL,
		"publicUrl": publicURL,
		"key":       key,
	})
}

// UploadToStorageHandler mimics an S3 bucket's PUT behavior
// It receives the raw binary body and saves it to disk
func UploadToStorageHandler(c *gin.Context) {
	key := c.Query("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key is required"})
		return
	}

	// strict safety check on key to prevent directory traversal
	key = filepath.Base(key)

	// Ensure uploads directory exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	dstPath := filepath.Join(uploadDir, key)

	// Create the file
	out, err := os.Create(dstPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
		return
	}
	defer out.Close()

	// Copy the request body (the file content) to the file on disk
	_, err = io.Copy(out, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write file"})
		return
	}

	c.Status(http.StatusOK)
}
