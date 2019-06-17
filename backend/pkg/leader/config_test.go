package leader

import (
	"net/http"
	"os"
	"regexp"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestConfig(t *testing.T) {
	err := os.Setenv("GITHUB_TOKEN", "dummy token")
	assert.NoError(t, err)
	got, err := Config()
	assert.NoError(t, err)

	createdAfter, _ := time.Parse(time.RFC3339, "2019-05-15T00:00:00Z")
	repo := Repository{
		Owner: "anz-bank",
		Name:  "go-course",
		URL:   "https://github.com/anz-bank/go-course",
	}

	expected := Configuration{
		ChartConfig: ChartDataConfig{
			LabelGlob:    "lab*",
			LabelRegexp:  regexp.MustCompile(`^lab\d`),
			BotName:      "golangcibot",
			CreatedAfter: createdAfter,
			Repository:   repo,
		},
		QueryConfig: QueryConfig{
			Token:        "dummy token",
			Cursor:       "",
			QueryPattern: buildQueryPattern(repo.Owner, repo.Name),
			Client:       &http.Client{},
			Repository:   repo,
		},
	}
	assert.Equal(t, expected, got)
}

func TestConfigFail(t *testing.T) {
	err := os.Setenv("GITHUB_TOKEN", "")
	assert.NoError(t, err)
	_, err = Config()
	assert.Error(t, err)
}
