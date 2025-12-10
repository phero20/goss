package resume

func SaveResume(userID uint, dataJSON, templateID string, isPublic bool) error {
	r := &Resume{
		UserID:     userID,
		DataJSON:   dataJSON,
		TemplateID: templateID,
		IsPublic:   isPublic,
	}
	return CreateOrUpdate(r)
}

func GetMyResume(userID uint) (*Resume, error) {
	return GetByUserID(userID)
}
