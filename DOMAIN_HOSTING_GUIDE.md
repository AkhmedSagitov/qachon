# Руководство: Покупка домена и запуск проекта

## Вариант 1: Vercel + Домен (РЕКОМЕНДУЕТСЯ - ПРОЩЕ ВСЕГО)

### Преимущества:
- ✅ Бесплатный хостинг для Next.js
- ✅ Автоматический SSL сертификат
- ✅ CDN по всему миру
- ✅ Простое подключение домена
- ✅ Автоматический деплой при push в GitHub

### Шаг 1: Покупка домена

Купите домен на одном из сервисов:
- **Reg.ru** (для .ru, .рф)
- **Namecheap** (международный)
- **GoDaddy** (международный)
- **Cloudflare** (дешевый, без наценки)

Примеры доменов:
- `tatarskaya-kuxnya.uz`
- `tatarskaya-kuxnya.com`
- `татарская-кухня.рф`

**Стоимость:** $10-15 в год

### Шаг 2: База данных (бесплатно)

Создайте бесплатную PostgreSQL базу на одном из сервисов:

#### Вариант A: Supabase (Рекомендуется)
1. Зайдите на https://supabase.com
2. Создайте аккаунт
3. New Project → укажите название и пароль
4. Перейдите в Settings → Database
5. Скопируйте Connection String (URI)

#### Вариант B: Neon
1. Зайдите на https://neon.tech
2. Создайте проект
3. Скопируйте connection string

#### Вариант C: Railway
1. Зайдите на https://railway.app
2. New Project → Provision PostgreSQL
3. Variables → скопируйте DATABASE_URL

**Лимиты бесплатного плана:**
- Supabase: 500MB, неограниченные запросы
- Neon: 10GB, 100 часов compute в месяц
- Railway: 500MB, $5 кредит в месяц

### Шаг 3: Деплой на Vercel

#### 3.1. Загрузите проект на GitHub
```bash
cd D:\Ahmed\projects\TatarskayaKuxnyaNextjs\kitchen

# Если еще не инициализирован git
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub.com и загрузите
git remote add origin https://github.com/ваш-username/tatarskaya-kuxnya.git
git push -u origin main
```

#### 3.2. Подключите к Vercel
1. Зайдите на https://vercel.com
2. Sign Up (через GitHub)
3. New Project
4. Import Git Repository → выберите ваш репозиторий
5. Configure Project:
   - Framework Preset: Next.js (определится автоматически)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3.3. Добавьте переменные окружения
В Vercel проекте:
1. Settings → Environment Variables
2. Добавьте:

```env
DATABASE_URL = postgresql://ваш-connection-string
NEXTAUTH_URL = https://ваш-домен.com
NEXTAUTH_SECRET = сгенерируйте-секретный-ключ
```

Для генерации NEXTAUTH_SECRET откройте терминал:
```bash
openssl rand -base64 32
```

3. Deploy

#### 3.4. Подключите домен
1. В Vercel проекте → Settings → Domains
2. Add Domain → введите ваш домен (например: `tatarskaya-kuxnya.com`)
3. Vercel покажет DNS записи, которые нужно добавить

#### 3.5. Настройте DNS у регистратора домена
В панели вашего регистратора (Reg.ru, Namecheap и т.д.):

**Вариант A: A Record (если Vercel показал IP)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

**Вариант B: CNAME (рекомендуется)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto
```

Для www поддомена:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

**Ждите 5-60 минут** пока DNS обновится.

#### 3.6. Инициализация базы данных
После первого деплоя выполните один раз:

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Залогиньтесь:
```bash
vercel login
```

3. Выполните команду для БД:
```bash
vercel env pull
npx prisma db push
```

Или используйте Vercel CLI для выполнения команды на сервере:
```bash
vercel exec -- npx prisma db push
```

### Готово! 🎉

Ваш сайт будет доступен по адресу:
- https://ваш-домен.com
- https://www.ваш-домен.com
- https://название-проекта.vercel.app (резервный)

---

## Вариант 2: VPS сервер (для полного контроля)

Если нужен полный контроль и своя БД на сервере.

### Шаг 1: Купите VPS

**Провайдеры:**
- **DigitalOcean** - $6/месяц (1GB RAM)
- **Hetzner** - €4.5/месяц (2GB RAM, дешевле)
- **Vultr** - $6/месяц
- **TimeWeb** (РФ) - от 200₽/месяц
- **Selectel** (РФ) - от 300₽/месяц

**Рекомендуемая конфигурация:**
- 2GB RAM минимум
- 1 CPU core
- 50GB SSD
- Ubuntu 22.04 LTS

### Шаг 2: Настройка сервера

Подключитесь к серверу по SSH:
```bash
ssh root@ваш-ip-адрес
```

#### 2.1. Обновите систему
```bash
apt update && apt upgrade -y
```

#### 2.2. Установите Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # Проверка
npm -v
```

#### 2.3. Установите PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Создайте базу данных
sudo -u postgres psql
```

В psql выполните:
```sql
CREATE DATABASE tatarskaya_kuxnya;
CREATE USER kuxnya_user WITH PASSWORD 'ваш-сильный-пароль';
GRANT ALL PRIVILEGES ON DATABASE tatarskaya_kuxnya TO kuxnya_user;
\q
```

#### 2.4. Установите PM2 (менеджер процессов)
```bash
npm install -g pm2
```

### Шаг 3: Загрузите проект

#### 3.1. Создайте пользователя
```bash
adduser deployer
usermod -aG sudo deployer
su - deployer
```

#### 3.2. Клонируйте проект
```bash
cd ~
git clone https://github.com/ваш-username/tatarskaya-kuxnya.git
cd tatarskaya-kuxnya
```

#### 3.3. Создайте .env файл
```bash
nano .env
```

Вставьте:
```env
DATABASE_URL="postgresql://kuxnya_user:ваш-пароль@localhost:5432/tatarskaya_kuxnya?schema=public"
NEXTAUTH_URL="https://ваш-домен.com"
NEXTAUTH_SECRET="сгенерированный-секретный-ключ"
PORT=3000
```

Сохраните (Ctrl+X, Y, Enter)

#### 3.4. Установите и запустите
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 start npm --name "tatarskaya-kuxnya" -- start
pm2 save
pm2 startup
```

Скопируйте и выполните команду, которую покажет `pm2 startup`.

### Шаг 4: Настройте Nginx

#### 4.1. Установите Nginx
```bash
sudo apt install -y nginx
```

#### 4.2. Создайте конфигурацию
```bash
sudo nano /etc/nginx/sites-available/tatarskaya-kuxnya
```

Вставьте:
```nginx
server {
    listen 80;
    server_name ваш-домен.com www.ваш-домен.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Сохраните.

#### 4.3. Активируйте конфигурацию
```bash
sudo ln -s /etc/nginx/sites-available/tatarskaya-kuxnya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Шаг 5: SSL сертификат (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.com -d www.ваш-домен.com
```

Следуйте инструкциям. Сертификат обновится автоматически.

### Шаг 6: Настройте DNS

В панели регистратора домена добавьте A-запись:
```
Type: A
Name: @
Value: IP-адрес-вашего-VPS
TTL: Auto
```

Для www:
```
Type: A
Name: www
Value: IP-адрес-вашего-VPS
TTL: Auto
```

### Готово! 🎉

Сайт доступен: https://ваш-домен.com

---

## Сравнение вариантов

| Параметр | Vercel | VPS |
|----------|--------|-----|
| **Стоимость** | $0 | $6-10/мес |
| **Сложность** | ⭐ Легко | ⭐⭐⭐ Средне |
| **Контроль** | Ограничен | Полный |
| **База данных** | Внешняя | На сервере |
| **SSL** | Автоматически | Нужно настроить |
| **Масштабирование** | Автоматическое | Ручное |
| **Время настройки** | 15 минут | 1-2 часа |

## Рекомендация

**Для начала используйте Vercel** - это быстро, просто и бесплатно.

Когда проект вырастет, можете перейти на VPS для полного контроля.

---

## Дополнительные ресурсы

- Документация Vercel: https://vercel.com/docs
- Документация Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- PM2: https://pm2.keymetrics.io/docs

## Нужна помощь?

Если возникнут проблемы при деплое, проверьте:
1. Логи в Vercel Dashboard или `pm2 logs`
2. Переменные окружения корректно установлены
3. База данных доступна
4. DNS записи обновились (проверка: https://dnschecker.org)
