@echo off
REM Скрипт для деплоя Tatarskaya Kuxnya (Windows)
REM Использование: deploy.bat

echo ========================================
echo    Деплой Tatarskaya Kuxnya
echo ========================================
echo.

REM Проверка наличия .env файла
if not exist .env (
    echo [ОШИБКА] Файл .env не найден!
    echo.
    echo Создайте файл .env с необходимыми переменными:
    echo   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    echo   NEXTAUTH_URL=https://ваш-домен.com
    echo   NEXTAUTH_SECRET=ваш-секретный-ключ
    echo.
    pause
    exit /b 1
)

echo [OK] Файл .env найден
echo.

REM Установка зависимостей
echo ========================================
echo 1/4: Установка зависимостей...
echo ========================================
call npm install
if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости
    pause
    exit /b 1
)
echo.

REM Генерация Prisma Client
echo ========================================
echo 2/4: Генерация Prisma Client...
echo ========================================
call npx prisma generate
if errorlevel 1 (
    echo [ОШИБКА] Не удалось сгенерировать Prisma Client
    pause
    exit /b 1
)
echo.

REM Применение миграций
echo ========================================
echo 3/4: Применение миграций БД...
echo ========================================
call npx prisma migrate deploy
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Ошибка при применении миграций
    echo Попробуйте вместо этого: npx prisma db push
    pause
    exit /b 1
)
echo.

REM Сборка проекта
echo ========================================
echo 4/4: Сборка проекта...
echo ========================================
call npm run build
if errorlevel 1 (
    echo [ОШИБКА] Не удалось собрать проект
    pause
    exit /b 1
)
echo.

echo ========================================
echo   ДЕПЛОЙ ЗАВЕРШЕН УСПЕШНО!
echo ========================================
echo.
echo Для запуска проекта выполните:
echo   npm start
echo.
echo Или укажите порт:
echo   set PORT=3000 ^&^& npm start
echo.
pause
