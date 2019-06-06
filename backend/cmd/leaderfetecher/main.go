package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/juliaogris/leaderboard/backend/pkg/leader"
)

func main() {
	cfg, err := leader.Config()
	if err != nil {
		log.Fatal(err)
	}
	prs, err := leader.QueryAPI(cfg.QueryConfig)
	if err != nil {
		log.Fatal("error querying GitHub QGL API v4", err)
	}
	chartData := leader.ChartDataFromPRs(prs, cfg.ChartConfig)
	bytes, _ := json.MarshalIndent(chartData, "", "  ")

	fmt.Println("Chart data JSON")
	fmt.Println("======================")
	fmt.Println(string(bytes))
	fmt.Println()
	fmt.Println("Aggregated chart data since", cfg.ChartConfig.CreatedAfter.Format("2006-01-02"))
	fmt.Println("======================================")
	fmt.Println("authors count:            ", len(chartData.Authors))
	fmt.Println("golangcibot comment count:", chartData.BotCommentCount)
	fmt.Println("total unfiltered PR count:", len(prs))
	fmt.Println()
	fmt.Println("Title                     |  Total Count | Number of User | Max Count")
	fmt.Println("---------------------------------------------------------------------")
	for _, c := range chartData.Charts {
		fmt.Printf("%25.25s | %11d | %15d | %8d\n", cap(c.Title, 25), c.TotalCount, len(c.Points), c.MaxCount)
	}
	fmt.Println()
}

func cap(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n-3] + "..."
}
