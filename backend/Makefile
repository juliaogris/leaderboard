COVERFILE=coverage.out
COLOUR_NORMAL=$(shell tput sgr0)
COLOUR_RED=$(shell tput setaf 1)
COVERAGE=100.0%

all: build test lint check-coverage
build:
	go build ./...
test:
	go test -coverprofile=$(COVERFILE) ./...
lint:
	golangci-lint run
check-coverage: test
	@echo 'check-coverage'
	@{ go tool cover -func=$(COVERFILE) | grep --color=none '^total:.*$(COVERAGE)'; } || { echo '$(COLOUR_RED)FAIL - Coverage below $(COVERAGE)$(COLOUR_NORMAL)'; exit 1; }
run:
	go run cmd/leaderfetecher/main.go
cover: test
	go tool cover -html=$(COVERFILE)
clean:
	go clean ./...
.PHONY: all build test lint check-coverage run cover clean
