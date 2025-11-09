# ✅ Чеклист для запуска сайта на домене

## 📋 Что вам нужно купить/получить:

- [ ] **Домен** (~$10-15/год)
  - Reg.ru, Namecheap, GoDaddy
  - Например: `tatarskaya-kuxnya.com`

- [ ] **Хостинг** (выберите один):
  - [ ] Vercel - **БЕСПЛАТНО** ✅ (рекомендуется)
  - [ ] VPS - $6-10/месяц (если нужен полный контроль)

- [ ] **База данных** (если используете Vercel):
  - [ ] Supabase - **БЕСПЛАТНО** ✅ (рекомендуется)
  - [ ] Neon - бесплатно
  - [ ] Railway - бесплатно

---

## 🚀 Быстрый старт (Vercel) - 15 минут

### Шаг 1: Подготовка (5 минут)
```bash
# 1. Загрузите проект на GitHub
cd D:\Ahmed\projects\TatarskayaKuxnyaNextjs\kitchen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ваш-username/tatarskaya-kuxnya.git
git push -u origin main

# 2. Сгенерируйте секретный ключ
openssl rand -base64 32
# Скопируйте результат
```

### Шаг 2: База данных (5 минут)
1. Зайдите на https://supabase.com
2. New Project → укажите название и пароль
3. Settings → Database → скопируйте Connection String (URI)

### Шаг 3: Vercel (5 минут)
1. Зайдите на https://vercel.com
2. Sign Up через GitHub
3. New Project → выберите репозиторий
4. Settings → Environment Variables → добавьте:
   ```
   DATABASE_URL = (вставьте connection string из Supabase)
   NEXTAUTH_URL = https://ваш-домен.com
   NEXTAUTH_SECRET = (вставьте сгенерированный ключ)
   ```
5. Deploy

### Шаг 4: Домен (уже купленный)
1. В Vercel → Settings → Domains → Add Domain
2. Введите ваш домен
3. В панели регистратора домена добавьте DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Ждите 5-30 минут

### Шаг 5: Инициализация БД
```bash
npm i -g vercel
vercel login
vercel env pull
npx prisma db push
```

### ✅ Готово!
Сайт доступен: https://ваш-домен.com

---

## 💰 Примерная стоимость

### Вариант 1: Vercel (рекомендуется)
- Домен: $12/год
- Vercel: $0
- База данных: $0
- **ИТОГО: $12/год ($1/месяц)**

### Вариант 2: VPS
- Домен: $12/год
- VPS: $72/год ($6/месяц)
- **ИТОГО: $84/год ($7/месяц)**

---

## 🆘 Частые проблемы

### Не работает после деплоя
- Проверьте переменные окружения в Vercel
- Проверьте логи: Vercel Dashboard → Deployments → последний деплой → Build Logs

### Не подключается к БД
- Убедитесь, что DATABASE_URL правильный
- В Supabase добавьте `?pgbouncer=true` в конец connection string

### Домен не работает
- Проверьте DNS: https://dnschecker.org
- DNS обновляется 5-60 минут

### Ошибка 500
- Проверьте NEXTAUTH_URL совпадает с реальным доменом
- Проверьте NEXTAUTH_SECRET установлен

---

## 📞 Контакты для поддержки

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## 🔄 Обновление сайта

После изменения кода:
```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически обновит сайт!
