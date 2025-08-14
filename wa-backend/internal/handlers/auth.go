// internal/handlers/auth.go
package handlers

import (
	"net/http"
	"time"
	"wa-backend/internal/middleware"
	"wa-backend/internal/models"
	"wa-backend/pkg/response"
	"wa-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db        *gorm.DB
	jwtSecret string
}

func NewAuthHandler(db *gorm.DB, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		db:        db,
		jwtSecret: jwtSecret,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := h.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		response.Error(c, http.StatusConflict, "User with this email already exists")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.InternalError(c, "Failed to hash password")
		return
	}

	// Create user
	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := h.db.Create(&user).Error; err != nil {
		response.InternalError(c, "Failed to create user")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, user.Email, h.jwtSecret, 24*time.Hour)
	if err != nil {
		response.InternalError(c, "Failed to generate token")
		return
	}

	// Return response
	authResponse := models.AuthResponse{
		User:  user.ToResponse(),
		Token: token,
	}

	response.Success(c, http.StatusCreated, "User registered successfully", authResponse)
}

// Login handles user authentication
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	// Find user by email
	var user models.User
	if err := h.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response.Error(c, http.StatusUnauthorized, "Invalid email or password")
			return
		}
		response.InternalError(c, "Database error")
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		response.Error(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, user.Email, h.jwtSecret, 24*time.Hour)
	if err != nil {
		response.InternalError(c, "Failed to generate token")
		return
	}

	// Return response
	authResponse := models.AuthResponse{
		User:  user.ToResponse(),
		Token: token,
	}

	response.Success(c, http.StatusOK, "Login successful", authResponse)
}

// GetProfile handles getting user profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response.NotFound(c, "User not found")
			return
		}
		response.InternalError(c, "Database error")
		return
	}

	response.Success(c, http.StatusOK, "Profile retrieved successfully", user.ToResponse())
}

// UpdateProfile handles updating user profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, exists := middleware.GetUserIDFromContext(c)
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response.NotFound(c, "User not found")
			return
		}
		response.InternalError(c, "Database error")
		return
	}

	// Update fields if provided
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		// Check if email is already taken by another user
		var existingUser models.User
		if err := h.db.Where("email = ? AND id != ?", req.Email, userID).First(&existingUser).Error; err == nil {
			response.Error(c, http.StatusConflict, "Email is already taken")
			return
		}
		user.Email = req.Email
	}

	if err := h.db.Save(&user).Error; err != nil {
		response.InternalError(c, "Failed to update user")
		return
	}

	response.Success(c, http.StatusOK, "Profile updated successfully", user.ToResponse())
}