@echo off
REM Упрощенный скрипт для деплоя (использует db push вместо миграций)
REM Использование: deploy-simple.bat

echo ========================================
echo    Быстрый деплой (db push)
echo ========================================
echo.

if not exist .env (
    echo [ОШИБКА] Файл .env не найден!
    pause
    exit /b 1
)

echo [1/4] Установка зависимостей...
call npm install || exit /b 1

echo.
echo [2/4] Генерация Prisma Client...
call npx prisma generate || exit /b 1

echo.
echo [3/4] Синхронизация схемы БД (db push)...
call npx prisma db push || exit /b 1

echo.
echo [4/4] Сборка проекта...
call npm run build || exit /b 1

echo.
echo ========================================
echo   ДЕПЛОЙ ЗАВЕРШЕН!
echo ========================================
echo.
echo Запустите проект: npm start
echo.
pause
