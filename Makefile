all : init-db build up

init-db :
	mkdir -p services/user-profile/src/data
	touch services/user-profile/src/data/user-profile.sqlite
	mkdir -p services/user-stats/src/data
	touch services/user-stats/src/data/user-stats.sqlite

up :
	docker compose -f infra/docker-compose.yml up -d

down :
	docker compose -f infra/docker-compose.yml down
	docker compose -f infra/docker-compose.yml down -v

stop :
	docker compose -f infra/docker-compose.yml stop

build :
	docker compose -f infra/docker-compose.yml build

exec :
	docker exec -it $(SERVICE) sh

logs :
	docker compose -f infra/docker-compose.yml logs -f

re : down all