package gcloudfunc

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/juliaogris/leaderboard/backend/pkg/leader"
)

const bucketName = "leader.go-course.org"
const objectName = "data.json"

// LeaderboardHTTP writes GitHub repo stats as JSON data for leaderboard charts
// to GCloud Storage bucket. This function is triggered by HTTP request,
// (https://cloud.google.com/functions/docs/writing/http). It doesn't care
// about parameters or response body (except for errors).
func LeaderboardHTTP(w http.ResponseWriter, r *http.Request) {
	if err := updateBucket(); err != nil {
		log.Printf("Error: %s\n", err)
		fmt.Fprintf(w, `{"error": "%s"}`+"\n", err)
		return
	}
	now := time.Now().Format(time.RFC3339)
	format := "Successfully updated %s/%s via HTTP (%s)\n"
	fmt.Fprintf(w, format, bucketName, objectName, now)
}

// LeaderboardEvent writes GitHub repo stats as JSON data for leaderboard charts
// to GCloud Storage bucket. This function is triggered by an PubSub event,
// intend for usage with Google Cloud Scheduler (cron job).
// (https://cloud.google.com/functions/docs/writing/background)
func LeaderboardEvent(ctx context.Context, _ interface{}) error {
	if err := updateBucket(); err != nil {
		log.Printf("Error: %s\n", err)
		return err
	}
	now := time.Now().Format(time.RFC3339)
	format := "Successfully updated %s/%s via Event (%s)\n"
	log.Printf(format, bucketName, objectName, now)
	return nil
}

func updateBucket() error {
	chartData, err := retrieveChartData()
	if err != nil {
		return err
	}
	jsonBytes, err := json.Marshal(chartData)
	if err != nil {
		return fmt.Errorf("updateBucket: cannot marshal chart data: %s", err)
	}
	if err = writeBucket(bytes.NewReader(jsonBytes)); err != nil {
		return err
	}
	return nil
}

func retrieveChartData() (*leader.ChartData, error) {
	cfg, err := leader.Config()
	if err != nil {
		err = fmt.Errorf("retrieveChartData: cannot create config: %s", err)
		return nil, err
	}
	prs, err := leader.QueryAPI(cfg.QueryConfig)
	if err != nil {
		err = fmt.Errorf("retrieveChartData: error querying GitHub API: %s", err)
		return nil, err
	}
	chartData := leader.ChartDataFromPRs(prs, cfg.ChartConfig)
	return &chartData, nil
}

func writeBucket(r io.Reader) error {
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("writeBucket: cannot create bucket client: %s", err)
	}
	defer client.Close()
	bucket := client.Bucket(bucketName)
	object := bucket.Object(objectName)
	w := object.NewWriter(ctx)
	defer w.Close()
	if _, err := io.Copy(w, r); err != nil {
		return fmt.Errorf("writeBucket: cannot copy reader to bucket: %s", err)
	}
	if err := w.Close(); err != nil {
		return fmt.Errorf("writeBucket: cannot close bucket writer: %s", err)
	}
	return nil
}
