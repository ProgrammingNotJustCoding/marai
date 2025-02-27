docker-start:
	@echo "Building Docker image..."
	@docker compose up --build -d

docker-restart:
	@echo "Restarting Docker container..."
	@docker compose restart

docker-stop:
	@echo "Stopping Docker container..."
	@docker compose down

docker-logs:
	@echo "Showing Docker logs..."
	@docker compose logs -f

docker-db-up:
	@echo "Starting containers..."
	@docker start marai-postgres

docker-db-down:
	@echo "Stopping containers..."
	@docker stop marai-postgres

docker-db-restart:
	@echo "Restarting containers..."
	@docker restart marai-postgres

docker-delete:
	@echo "Deleting Docker containers..."
	@docker compose down --volumes --networks --remove-orphans
