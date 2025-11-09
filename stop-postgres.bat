@echo off
echo Stopping PostgreSQL...
pg_ctl -D "C:\ProgramData\scoop\apps\postgresql\current\data" stop
echo.
echo PostgreSQL has been stopped.
echo.
pause
