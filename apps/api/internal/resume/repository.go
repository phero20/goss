package resume

import "resume-api/pkg/db"

func CreateOrUpdate(resume *Resume) error {
	return db.DB.Save(resume).Error
}

func GetByUserID(userID uint) (*Resume, error) {
	var r Resume
	err := db.DB.Where("user_id = ?", userID).First(&r).Error
	return &r, err
}

func GetBySlug(slug string) (*Resume, error) {
	var r Resume
	err := db.DB.Where("slug = ? AND is_public = true", slug).First(&r).Error
	return &r, err
}
