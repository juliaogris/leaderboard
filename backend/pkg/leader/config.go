package leader

import (
	"fmt"
	"net/http"
	"os"
	"regexp"
	"time"
)

// Config returns configuration for retrieving data via GitHub API (query)
// and building aggregated Chart Data
func Config() (Configuration, error) {
	// TODO(juliaogris): read from config file and/or command line
	initialCursor := ""
	createdAfter, _ := time.Parse(time.RFC3339, "2019-05-15T00:00:00Z")
	labelPattern := `^lab`
	botName := "golangcibot"
	repoOwner := "anz-bank"
	repoName := "go-course"
	queryPattern := buildQueryPattern(repoOwner, repoName)
	client := &http.Client{}
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		return Configuration{}, fmt.Errorf("GITHUB_TOKEN environment variable missing")
	}

	repo := Repository{
		Name:  repoName,
		Owner: repoOwner,
		URL:   fmt.Sprintf("https://github.com/%s/%s", repoOwner, repoName),
	}
	chartConfig := ChartDataConfig{
		LabelRegexp:  regexp.MustCompile(labelPattern),
		BotName:      botName,
		CreatedAfter: createdAfter,
		Repository:   repo,
	}
	queryConfig := QueryConfig{
		Token:        token,
		Cursor:       initialCursor,
		QueryPattern: queryPattern,
		Client:       client,
		Repository:   repo,
	}
	cfg := Configuration{
		ChartConfig: chartConfig,
		QueryConfig: queryConfig,
	}
	return cfg, nil
}

// Configuration holds configuration for retrieving data via GitHub API (query)
// and building aggregated Chart Data
type Configuration struct {
	ChartConfig ChartDataConfig
	QueryConfig QueryConfig
}

// ChartDataConfig contains filters, constants and meta data for aggregating
// chartable data from PRs
type ChartDataConfig struct {
	LabelRegexp  *regexp.Regexp
	BotName      string
	CreatedAfter time.Time
	Repository   Repository
}

// QueryConfig contains values for building the GitHub GraphQL query to
// retrieve PRs, as well as, http client and auth token to by used
type QueryConfig struct {
	Token        string
	Cursor       string
	QueryPattern string
	Client       *http.Client
	Repository   Repository
}
