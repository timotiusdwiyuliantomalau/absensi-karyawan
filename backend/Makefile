# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
BINARY_NAME=transaction-api
BINARY_PATH=./cmd/server/main.go

# Docker parameters
DOCKER_IMAGE=transaction-api
DOCKER_TAG=latest

.PHONY: all build clean test coverage deps run docker-build docker-run docker-up docker-down help

## help: Show this help message
help:
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

## all: Build the application
all: test build

## build: Build the binary
build:
	$(GOBUILD) -o $(BINARY_NAME) -v $(BINARY_PATH)

## clean: Clean build files
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f coverage.out coverage.html

## test: Run tests
test:
	$(GOTEST) -v ./...

## coverage: Run tests with coverage
coverage:
	$(GOTEST) -coverprofile=coverage.out ./...
	$(GOCMD) tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

## deps: Download dependencies
deps:
	$(GOMOD) download
	$(GOMOD) tidy

## run: Run the application
run:
	$(GOCMD) run $(BINARY_PATH)

## dev: Run in development mode
dev:
	@echo "Starting development server..."
	@$(GOCMD) run $(BINARY_PATH)

## docker-build: Build Docker image
docker-build:
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

## docker-run: Run Docker container
docker-run:
	docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE):$(DOCKER_TAG)

## docker-up: Start services with docker-compose
docker-up:
	docker-compose up -d

## docker-down: Stop services with docker-compose
docker-down:
	docker-compose down

## docker-logs: Show docker-compose logs
docker-logs:
	docker-compose logs -f

## lint: Run golangci-lint
lint:
	golangci-lint run

## fmt: Format code
fmt:
	$(GOCMD) fmt ./...

## vet: Run go vet
vet:
	$(GOCMD) vet ./...

## install: Install the application
install:
	$(GOCMD) install $(BINARY_PATH)

## migrate: Run database migrations
migrate:
	@echo "Running database migrations..."
	@$(GOCMD) run scripts/migrate.go

## seed: Seed the database with sample data
seed:
	@echo "Seeding database with sample data..."
	@$(GOCMD) run scripts/seed.go