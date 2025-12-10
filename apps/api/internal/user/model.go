package user

import (
	"time"
)

type User struct {
	ID            uint      `gorm:"primaryKey"`
	Name          string    `gorm:"not null"`
	Email         string    `gorm:"unique;not null"`
	PasswordHash string    `gorm:"not null"`
	Role          string    `gorm:"default:USER"`
	PaymentStatus string    `gorm:"default:FREE"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
