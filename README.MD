# v.0.0.3 Ejemplo de sistema de cita previa

Ejecutar la aplicación (con docker-compose):

$ ./startup.sh

API:

POST /centralreservas/users/:user/meetings

GET /centralreservas/diaries/:diary/meetings

GET /centralreservas/meetings

GET /centralreservas/meetings/:cita

GET /centralreservas/users/:user/meetings

GET /centralreservas/diaries

GET /centralreservas/status

DELETE /centralreservas/:cita

DELETE /centralreservas/meetings

Prueba:

http://http://localhost:3000/centralreservas/status
