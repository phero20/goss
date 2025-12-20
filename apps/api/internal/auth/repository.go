package auth

import (
	"resume-api/internal/user"
	"resume-api/pkg/db"
)

func CreateUser(user *user.User) error {
	return db.DB.Create(user).Error
}

func GetUserByEmail(email string) (*user.User, error) {
	var u user.User
	err := db.DB.Where("email = ?", email).First(&u).Error
	return &u, err
}

func GetUserByID(id uint) (*user.User, error) {
	var u user.User
	err := db.DB.First(&u, id).Error
	return &u, err
}
