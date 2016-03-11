# Ejemplo de sistema de cita previa

Ejecutar la aplicación (con docker-compose):

$ ./startup.sh

API:

POST /citaprevia/users/:user/meetings

GET /citaprevia/doctors/:doctor/meetings

GET /citaprevia/meetings

GET /citaprevia/meetings/:cita

GET /citaprevia/users/:user/meetings

GET /citaprevia/doctors

GET /citaprevia/status

DELETE /citaprevia/:cita

DELETE /citaprevia/meetings

Prueba:

http://http://localhost:3000/citaprevia/status
