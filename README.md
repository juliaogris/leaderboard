# Leaderboard

_Leaderboard_ aggregates data by GitHub user on:

-   merged PRs (Pull Requests)
-   open and merged PRs
-   PR reviews
-   PR review comments

on [anz-bank/go-course](https://github.com/anz-bank/go-course).

## Development

### Prerequisites

-   Install [go 1.12](https://golang.org/doc/install)
-   Install [golangci-lint 1.16](https://github.com/golangci/golangci-lint#install)
-   Install `make`

### Make

Build, test, lint and check coverage for this project with

    cd backend
    make

Produce a coverage report with

    make cover

Run the project with

    make run

Alternatively execute the commands given in the [`Makefile`](backend/Makefile)
separately in your terminal.
