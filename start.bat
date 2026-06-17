@echo off

set MONGODB_URI=mongodb+srv://Birthday_Board_DB_UserName:ZNr3xjDpCGaM9ii8RQDNsfWKmNkE@cluster0.vhwy8.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0

if not exist .env (
  for /f "delims=" %%i in ('node -e "process.stdout.write(require('crypto').randomBytes(64).toString('hex'))"') do set JWT_SECRET=%%i
  (
    echo MONGODB_URI=%MONGODB_URI%
    echo JWT_SECRET=%JWT_SECRET%
  ) > .env
  echo .env created
)

docker-compose up --build
