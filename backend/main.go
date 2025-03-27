package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type AppResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	URL         string `json:"url"`
	Category    string `json:"category"`
	Icon        string `json:"icon,omitempty"`
}

type TranslationRequest struct {
	Text       string `json:"text"`
	SourceLang string `json:"sourceLang"`
	TargetLang string `json:"targetLang"`
}

type TranslationResponse struct {
	TranslatedText string `json:"translatedText"`
}

type AI4Request struct {
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func main() {
	// Load environment variables from .env file
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}

	// Create router
	r := mux.NewRouter()

	// Routes
	r.HandleFunc("/api/search", searchAppsHandler).Methods("GET")
	r.HandleFunc("/api/translate", translateHandler).Methods("POST")
	r.HandleFunc("/api/ai", aiHandler).Methods("POST")
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")

	// CORS handling
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Start server
	port := "8080"
	fmt.Printf("Starting server on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(r)))
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func searchAppsHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	
	// Get GitHub token from environment
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		log.Println("GitHub token not found, using mock data")
		mockSearchApps(w, query)
		return
	}

	// In a real app, this would make a real API call to GitHub Marketplace
	// For demo purposes, we'll use mock data with a small delay
	time.Sleep(500 * time.Millisecond)
	mockSearchApps(w, query)
}

func mockSearchApps(w http.ResponseWriter, query string) {
	mockApps := []AppResponse{
		{
			ID:          "1",
			Name:        "CodeQL",
			Description: "Semantic code analysis engine that helps you identify vulnerabilities",
			URL:         "https://github.com/marketplace/codeql",
			Category:    "Security",
			Icon:        "https://github.githubassets.com/images/modules/marketplace/codeql.png",
		},
		{
			ID:          "2",
			Name:        "CircleCI",
			Description: "Continuous integration and delivery platform",
			URL:         "https://github.com/marketplace/circleci",
			Category:    "CI/CD",
			Icon:        "https://github.githubassets.com/images/modules/marketplace/circleci.png",
		},
		{
			ID:          "3",
			Name:        "Sentry",
			Description: "Application monitoring and error tracking software",
			URL:         "https://github.com/marketplace/sentry",
			Category:    "Monitoring",
			Icon:        "https://github.githubassets.com/images/modules/marketplace/sentry.png",
		},
		{
			ID:          "4",
			Name:        "Dependabot",
			Description: "Automated dependency updates",
			URL:         "https://github.com/marketplace/dependabot",
			Category:    "Dependencies",
			Icon:        "https://github.githubassets.com/images/modules/marketplace/dependabot.png",
		},
		{
			ID:          "5",
			Name:        "GitHub Actions",
			Description: "Automate your workflow from idea to production",
			URL:         "https://github.com/features/actions",
			Category:    "Automation",
			Icon:        "https://github.githubassets.com/images/modules/marketplace/actions.png",
		},
	}

	var filteredApps []AppResponse
	if query == "" {
		filteredApps = mockApps
	} else {
		for _, app := range mockApps {
			if containsIgnoreCase(app.Name, query) || 
			   containsIgnoreCase(app.Description, query) || 
			   containsIgnoreCase(app.Category, query) {
				filteredApps = append(filteredApps, app)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filteredApps)
}

func translateHandler(w http.ResponseWriter, r *http.Request) {
	var req TranslationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Mock translation (in a real app, this would use a translation API)
	// Just reversing the text for demo purposes
	translatedText := reverseString(req.Text)

	response := TranslationResponse{
		TranslatedText: translatedText,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func aiHandler(w http.ResponseWriter, r *http.Request) {
	var req AI4Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// In a real implementation, this would call the GPT-4o API
	// For demo purposes, we're just echoing back the last message
	response := map[string]string{
		"response": "This is a mock AI response. In a real implementation, we would call GPT-4o.",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Helper functions
func containsIgnoreCase(s, substr string) bool {
	s, substr = lower(s), lower(substr)
	return contains(s, substr)
}

func lower(s string) string {
	return s
}

func contains(s, substr string) bool {
	return true
}

func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
} 