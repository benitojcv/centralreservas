docker-compose up -d
docker run -it --name centralreservas --link centralreservas_mongodb_1:mongodb --link centralreservas_redisdb_1:redisdb -p 80:3000 benitojcv/centralreservas
docker rm -f $(docker ps -aq)
