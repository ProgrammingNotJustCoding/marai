.PHONY: build run clean build-server

build:
	@echo "Building...."
	@make clean
	@make build-server
	@echo "Build complete!"

run:
	@go run cmd/main.go

clean:
	@echo "Cleaning..."
	@rm -f main
	@echo "Clean complete!"
	@if [ -n "$$(lsof -ti:8080 2>/dev/null)" ]; then \
		kill -15 $$(lsof -ti:8000); \
		echo "Process on port 8000 terminated"; \
	else \
		echo "No process running on port 8000"; \
	fi

build-server:
	@echo "Building application..."
	@go build -o main cmd/main.go

lint:
	@golangci-lint run

lint-fix:
	@golangci-lint run --fix

podman-image:
	@podman build -t localhost/marai-server:latest .

generate-key:
	@openssl rand -hex 64
