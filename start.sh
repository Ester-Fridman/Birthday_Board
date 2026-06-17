#!/bin/bash

MONGODB_URI=mongodb+srv://Birthday_Board_DB_UserName:ZNr3xjDpCGaM9ii8RQDNsfWKmNkE@cluster0.vhwy8.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0

if [ ! -f .env ]; then
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  echo "MONGODB_URI=$MONGODB_URI" > .env
  echo "JWT_SECRET=$JWT_SECRET" >> .env
  echo ".env created"
fi

docker-compose up --build
