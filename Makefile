all : build up

up :
	docker compose -f infra/docker-compose.yml up -d

down :
	docker compose -f infra/docker-compose.yml down

stop :
	docker compose -f infra/docker-compose.yml stop

build :
	docker compose -f infra/docker-compose.yml build

logs :
	docker logs -f $(SERVICE)

exec :
	docker exec -it $(SERVICE) sh

re : down build up