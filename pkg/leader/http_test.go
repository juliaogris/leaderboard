package leader

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestQueryAPI(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, prResultFixture)
	}))
	defer ts.Close()
	githubURL = ts.URL

	config := QueryConfig{
		Token:  "dummy-token",
		Cursor: "dummy-cursor",
		Client: ts.Client(),
	}
	prs, err := QueryAPI(config)
	assert.NoError(t, err)
	assert.NotNil(t, prs)
	assert.Len(t, prs, 3)
}

func TestQueryAPIPaging(t *testing.T) {
	callCount := 0
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if callCount == 0 {
			fmt.Fprintln(w, prResultFixtureWithNextPage)
		} else {
			fmt.Fprintln(w, prResultFixture)
		}
		callCount++
	}))
	defer ts.Close()
	githubURL = ts.URL
	config := QueryConfig{
		Token:  "dummy-token",
		Cursor: "dummy-cursor",
		Client: ts.Client(),
	}
	prs, err := QueryAPI(config)
	assert.NoError(t, err)
	assert.NotNil(t, prs)
	assert.Len(t, prs, 3)
}

func TestQueryAPIPagingError(t *testing.T) {
	callCount := 0
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if callCount == 0 {
			fmt.Fprintln(w, prResultFixtureWithNextPage)
		} else {
			fmt.Fprintln(w, "bad json")
		}
		callCount++
	}))
	defer ts.Close()
	githubURL = ts.URL
	config := QueryConfig{Client: ts.Client()}
	_, err := QueryAPI(config)
	assert.Error(t, err)
}

func TestQueryAPIError(t *testing.T) {
	config := QueryConfig{Client: &http.Client{}}

	githubURL = "bad-url"
	_, err := QueryAPI(config)
	assert.Error(t, err)
	msg := strings.ToLower(err.Error())
	assert.Contains(t, msg, "unsupported protocol scheme")

	githubURL = fmt.Sprintf("%c  control char", 0x7f)
	_, err = QueryAPI(config)
	assert.Error(t, err)
	msg = strings.ToLower(err.Error())
	assert.Contains(t, msg, "invalid control character")
	assert.Contains(t, msg, "net/url")
}

func TestQueryAPIBadJSON(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "bad-json")
	}))
	defer ts.Close()
	githubURL = ts.URL

	config := QueryConfig{Client: ts.Client()}
	_, err := QueryAPI(config)
	assert.Error(t, err)
	assert.IsType(t, &json.SyntaxError{}, err)
}

type errCloser struct{}

func (t *errCloser) Close() error { return fmt.Errorf("always error on close") }

func TestClose(t *testing.T) {
	var b bytes.Buffer
	log.SetOutput(&b)
	ec := &errCloser{}
	close(ec)
	msg := b.String()
	assert.Contains(t, msg, "error closing")
}
