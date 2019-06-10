package leader

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

var githubURL = "https://api.github.com/graphql"

// QueryAPI requests PR data from GitHub API v4 (GraphQL).
// Responses can hold a maximum of 100 PRs due to GitHub rate limiting.
// If there are more than 100 PRs subsequent queries issued recursively
// will request the following "pages" of data starting at the "cursor" value.
// All PR data is aggregated into one data structure and returned as slice of
// PRNode
func QueryAPI(config QueryConfig) ([]PRNode, error) {
	q := buildQuery(config.QueryPattern, config.Cursor)
	log.Println("query cursor", config.Cursor)
	req, err := http.NewRequest("POST", githubURL, bytes.NewBuffer([]byte(q)))
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "bearer "+config.Token)
	resp, err := config.Client.Do(req)
	if err != nil {
		return nil, err
	}
	data := graphQLdata{}
	defer close(resp.Body)
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	prs := data.Data.Repository.PullRequests
	PRNodes := prs.PRNodes
	if prs.PageInfo.HasNextPage {
		config.Cursor = prs.PageInfo.EndCursor
		p, err := QueryAPI(config)
		if err != nil {
			return nil, err
		}
		PRNodes = append(PRNodes, p...)
	}
	return PRNodes, nil
}

func close(c io.Closer) {
	if err := c.Close(); err != nil {
		log.Println("error closing", err)
	}
}
