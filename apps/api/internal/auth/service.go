package auth

import (
	"errors"
	"resume-api/internal/user"
	"resume-api/pkg/utils"

	"gorm.io/gorm"
)

func Register(name, email, password string) (string, error) {
	hash, err := utils.HashPassword(password)
	if err != nil {
		return "", err
	}

	u := &user.User{
		Name:          name,
		Email:         email,
		PasswordHash: hash,
	}

	if err := CreateUser(u); err != nil {
		return "", err
	}

	token, err := utils.GenerateJWT(u.ID, u.Email, u.Role)
	return token, err
}

func Login(email, password string) (string, error) {
	u, err := GetUserByEmail(email)
	if err == gorm.ErrRecordNotFound {
		return "", errors.New("user not found")
	}

	if !utils.CheckPassword(password, u.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(u.ID, u.Email, u.Role)
	return token, err
}
