docker-compose up -d
docker run -it --name citaprevia --link citaprevia_mongodb_1:mongodb --link citaprevia_redisdb_1:redisdb -p 80:3000 benitojcv/citaprevia
docker rm -f $(docker ps -aq)
