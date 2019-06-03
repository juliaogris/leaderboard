package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const prURL = "https://api.github.com/repos/anz-bank/go-course/pulls?state=all&page="

type pr struct {
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	URL       string    `json:"url"`
	Number    int       `json:"number"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	ClosedAt  time.Time `json:"closed_at"`
	MergedAt  time.Time `json:"merged_at"`
	User      user      `json:"user"`
	// TODO Lab
}

func (pr pr) String() string {
	createdAt := pr.CreatedAt.Format("2006-01-02 15:04")
	return fmt.Sprintf("%s %d %s %s", createdAt, pr.Number, pr.User.Login, pr.Title)
}

type user struct {
	Login     string
	ID        int
	AvatarURL string
	HTMLURL   string
}

type prResult struct {
	prs        []pr
	linkHeader string
	err        error
}

func close(c io.Closer) {
	if err := c.Close(); err != nil {
		log.Println("error closing", err)
	}
}

func getPagedprs(token string, page int, ch chan prResult) {
	// todo(juliaogris) use token for header
	url := prURL + strconv.Itoa(page)
	log.Println("getting", url, "token", token[:10])
	r, err := http.Get(url)
	if err != nil {
		ch <- prResult{prs: nil, linkHeader: "", err: err}
		return
	}
	prs := []pr{}
	defer close(r.Body)
	err = json.NewDecoder(r.Body).Decode(&prs)
	ch <- prResult{prs: prs, linkHeader: r.Header.Get("Link"), err: err}
}

var pagesRe = regexp.MustCompile(`page=(\d+)>; rel="last"`)

func numPages(linkHeader string) (int, error) {
	if linkHeader == "" {
		return -1, fmt.Errorf("couldn't get Link header")
	}
	match := pagesRe.FindSubmatch([]byte(linkHeader))
	if match == nil {
		return -1, fmt.Errorf(`cannot find page count in link header %v`, linkHeader)
	}
	return strconv.Atoi(string(match[1]))
}

func getprs(token string) ([]pr, error) {
	ch := make(chan prResult)
	go getPagedprs(token, 1, ch)
	prResult := <-ch
	if prResult.err != nil {
		return nil, prResult.err
	}
	numPages, err := numPages(prResult.linkHeader)
	if err != nil {
		return nil, err
	}
	prs := prResult.prs
	for i := 2; i <= numPages; i++ {
		go getPagedprs(token, i, ch)
	}
	for i := 2; i <= numPages; i++ {
		prResult = <-ch
		if prResult.err != nil {
			return nil, prResult.err
		}
		prs = append(prs, prResult.prs...)
	}
	return prs, nil
}

func toString(prs []pr) string {
	s := make([]string, len(prs))
	for i := range prs {
		s[i] = prs[i].String()
	}
	return strings.Join(s, "\n")
}

func main() {
	var token = os.Getenv("GITHUB_TOKEN")
	if token == "" {
		log.Fatal("GITHUB_TOKEN environment variable missing")
	}
	prs, err := getprs(token)
	if err != nil {
		log.Fatal("error getting prs: ", err)
	}
	fmt.Println(toString(prs))
}
