package resume

import "time"

type Resume struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     uint      `gorm:"uniqueIndex"`
	Slug       string    `gorm:"uniqueIndex"` // ✅ public URL slug
	DataJSON   string    `gorm:"type:jsonb"`  // Full resume as JSON
	TemplateID string
	PDFUrl     string
	IsPublic   bool      `gorm:"default:false"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
