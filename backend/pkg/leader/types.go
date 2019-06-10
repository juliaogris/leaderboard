package leader

import (
	"regexp"
	"sort"
	"time"
)

type graphQLdata struct {
	Data struct {
		Repository struct {
			URL          string `json:"url"`
			PullRequests struct {
				TotalCount int `json:"totalCount"`
				PageInfo   struct {
					EndCursor   string `json:"endCursor"`
					HasNextPage bool   `json:"hasNextPage"`
				} `json:"pageInfo"`
				PRNodes []PRNode `json:"nodes"`
			} `json:"pullRequests"`
		} `json:"repository"`
	} `json:"data"`
}

// PRNode represents a GraphQL response node for a PR (Pull Request)
// It contains in all labels and reviews for the PR.
// Reviews contain authors and the total count of comments.
type PRNode struct {
	Number    int       `json:"number"`
	URL       string    `json:"url"`
	State     string    `json:"state"`
	Title     string    `json:"title"`
	Author    Author    `json:"author"`
	CreatedAt time.Time `json:"createdAt"`
	Reviews   struct {
		ReviewNodes []Review `json:"nodes"`
	} `json:"reviews"`
	Labels struct {
		LabelNodes []Label `json:"nodes"`
	} `json:"labels"`
}

// Review represents GitHub Pull Request Review, details are omitted.
type Review struct {
	Author   Author `json:"author"`
	Comments struct {
		TotalCount int `json:"totalCount"`
	} `json:"comments"`
}

// Label represents GitHub label as used on Issues and PRs.
type Label struct {
	Name string `json:"name"`
}

// Author represents GitHub user who authored PR, Review, etc.
type Author struct {
	Login     string `json:"login"`
	URL       string `json:"url"`
	AvatarURL string `json:"avatarURL"`
}

// ChartData holds all aggregate PR, review and comment data relevant to
// visualisation.
type ChartData struct {
	Authors         map[string]Author `json:"authors"` // keyed by author.login (github username)
	Charts          []Chart           `json:"chart"`
	BotCommentCount int               `json:"botComments"`
	Repository      Repository        `json:"repository"`
}

// Chart contains data points, aggregated and meta data for charting.
type Chart struct {
	Title      string  `json:"title"`
	MaxCount   int     `json:"maxCount"`
	TotalCount int     `json:"totalCount"`
	Points     []Point `json:"points"`
}

// Point contains chartable data point per for a GitHub user. Count may
// represent total number of Pull Requests merged, merged or open, reviews,
// comments etc. per user.
type Point struct {
	Author string `json:"author"`
	Count  int    `json:"count"`
}

// Repository meta data used in ChartData
type Repository struct {
	Name  string `json:"name"`
	Owner string `json:"owner"`
	URL   string `json:"url"`
}

type countByAuthor struct {
	pr      map[string]int
	open    map[string]int
	review  map[string]int
	comment map[string]int
}

func newCountByAuthor() countByAuthor {
	return countByAuthor{
		pr:      map[string]int{},
		open:    map[string]int{},
		review:  map[string]int{},
		comment: map[string]int{},
	}
}

// ChartDataFromPRs creates relevant struct for visualising aggregated
// PR, review and comment data. Input to this function is PR data as
// returned by GitHub API v4 (GraphQL).
func ChartDataFromPRs(gqlPRs []PRNode, config ChartDataConfig) ChartData {
	countByAuthor := newCountByAuthor()
	authors := map[string]Author{}
	for _, pr := range gqlPRs {
		if !pr.CreatedAt.After(config.CreatedAfter) {
			continue
		}
		if !hasLabLabel(pr.Labels.LabelNodes, config.LabelRegexp) {
			continue
		}
		author := pr.Author.Login
		authors[author] = pr.Author
		if pr.State == "MERGED" {
			countByAuthor.pr[author]++
		}
		if pr.State == "MERGED" || pr.State == "OPEN" {
			countByAuthor.open[author]++
		}
		for _, review := range pr.Reviews.ReviewNodes {
			author := review.Author.Login
			authors[author] = review.Author
			countByAuthor.review[author]++
			// Add 1 to comment count because the review itself must contain a "comment" which isn't counted.
			countByAuthor.comment[author] += 1 + review.Comments.TotalCount
		}
	}
	botCommentCount := countByAuthor.comment[config.BotName]
	delete(countByAuthor.comment, config.BotName)
	delete(countByAuthor.review, config.BotName)
	return ChartData{
		Authors:         authors,
		BotCommentCount: botCommentCount,
		Charts:          charts(countByAuthor),
		Repository:      config.Repository,
	}
}

func charts(countByAuthor countByAuthor) []Chart {
	result := []Chart{}
	if len(countByAuthor.pr) != 0 {
		c := chart(countByAuthor.pr, "Merged Pull Requests")
		result = append(result, c)
	}
	if len(countByAuthor.open) != 0 {
		c := chart(countByAuthor.open, "Merged or Open Pull Requests")
		result = append(result, c)
	}
	if len(countByAuthor.review) != 0 {
		c := chart(countByAuthor.review, "Code Reviews")
		result = append(result, c)
	}
	if len(countByAuthor.comment) != 0 {
		c := chart(countByAuthor.comment, "Code Review Comments")
		result = append(result, c)
	}
	return result
}

func chart(countByAuthor map[string]int, title string) Chart {
	max := 0
	points := make([]Point, len(countByAuthor))
	i := 0
	total := 0
	for author, count := range countByAuthor {
		if count > max {
			max = count
		}
		points[i] = Point{Author: author, Count: count}
		total += count
		i++
	}
	sort.Slice(points, func(i, j int) bool { return points[i].Count > points[j].Count })
	return Chart{
		Title:      title,
		Points:     points,
		TotalCount: total,
		MaxCount:   max,
	}
}

func hasLabLabel(labels []Label, re *regexp.Regexp) bool {
	if re == nil {
		return true
	}
	for _, l := range labels {
		if re.MatchString(l.Name) {
			return true
		}
	}
	return false
}
