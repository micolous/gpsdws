#!/bin/sh
# Generates a simple self-signed certificate for the application.
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 3650 -subj "/CN=localhost/O=gpsdws/OU=`uname -n`" -nodes
cat cert.pem key.pem > server.pem
chmod go-rw server.pm key.pem

