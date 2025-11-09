@echo off
echo Starting PostgreSQL...
pg_ctl -D "C:\ProgramData\scoop\apps\postgresql\current\data" start
echo.
echo PostgreSQL is now running!
echo You can now use pgAdmin or run your Next.js app.
echo.
pause
