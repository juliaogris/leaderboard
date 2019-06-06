# Leaderboard

_Leaderboard_ aggregates data by GitHub user on:

-   merged PRs (Pull Requests)
-   open and merged PRs
-   PR reviews
-   PR review comments

on [anz-bank/go-course](https://github.com/anz-bank/go-course).

## Development

This projects consist of a backend written in `go` and a frontend build with
`ReactJS`.

The GitHub API is not directly queried by frontend because of rate limiting and
performance as well as user experience and authentication concerns.

### Backend

Code location: `backend`
Language: `go`

The backend is concerned with PR data retrieval from GitHub API v4 (GraphQL)
and transformation into aggregated, chartable data.

#### Prerequisites

-   Install [go 1.12](https://golang.org/doc/install)
-   Install [golangci-lint 1.16](https://github.com/golangci/golangci-lint#install)
-   Install `make`

#### Make

Build, test, lint and check coverage for this project with

    cd backend
    make

Produce a coverage report with

    make cover

Run the project with

    make run

Alternatively execute the commands given in the [`Makefile`](backend/Makefile)
separately in your terminal.

### Frontend

Code location: `frontend`
Language: `ReactJS`

The frontend visualises PR stats as a series of bar charts. It retrieves the
underlying processed and aggregated PR data as JSON and renders somewhat
interactive SVG bar charts.

#### Prerequisites

-   Install [node](https://nodejs.org/en/download/)
-   Install `make`

#### Make

Run, build, test, lint, format and check coverage for this project with

    cd frontend
    make

Produce a coverage report in file watch mode with

    make cover

Run frontend in development mode with

    make start

Alternatively execute the commands given in the [`Makefile`](frontend/Makefile)
separately in your terminal the details of the yarn commands can be found at
[`package.json`](frontend/package.json).

## CI

CI (Continuous Integration) runs on Google Cloudbuilds and is configured in
[`cloudbuilds.yaml`](cloudbuilds.yaml).
The linked Google Cloud build project is
[`gotraining`](https://console.cloud.google.com/cloud-build/triggers?project=gotraining),
request access from [@juliaogris](https://github.com/juliaogris) if needed.

Builds can bet triggered locally with:

    gcloud builds submit

`.gcloudignore` holds files not to be uploaded to Cloudbuilds (`.git`, `frontend/node_modules`).
