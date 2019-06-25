package leader

import (
	"fmt"
	"strings"
)

func buildQueryPattern(owner, name string) string {
	s := fmt.Sprintf(gqlFragment, owner, name)
	s = strings.Replace(s, `"`, `\"`, -1)
	s = strings.Replace(s, "\n", " ", -1)
	return fmt.Sprintf(`{ "query": "query %s"}`, s)
}

func buildQuery(queryPattern, cursor string) string {
	afterCursorExpr := ""
	if cursor != "" {
		afterCursorExpr = fmt.Sprintf(`, after: \"%s\"`, cursor)
	}
	return fmt.Sprintf(queryPattern, afterCursorExpr)
}

const gqlFragment = `{
  repository(owner: "%s", name: "%s") {
    url
    pullRequests(first: 100 %%s) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        number
        url
        state
        title
        createdAt
        author {
          login
          url
          avatarUrl
        }
        reviews(first: 20) {
          nodes {
            author {
              login
              url
              avatarUrl
            }
            comments(first: 60) {
              totalCount
            }
          }
        }
        labels(first: 10) {
          nodes {
            name
          }
        }
      }
    }
  }
}
`
