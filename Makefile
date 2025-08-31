docker up:
	cd docker && docker compose -p marai up -d

docker down:
	cd docker && docker compose -p marai down -v
