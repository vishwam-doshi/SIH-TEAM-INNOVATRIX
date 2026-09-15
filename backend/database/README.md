# MySQL setup for AgriSmart backend

This backend was converted from MongoDB/Mongoose to MySQL.

## 1. Create the database

```bash
mysql -u root -p < database/schema.sql
```

This creates the `agrismart` database with:
- `users` — replaces the old `User` / `login_user` Mongoose models (both actually
  pointed at the same Mongo collection, so they're now one clean table).
- `sessions` — used by `express-mysql-session`

## 2. Configure environment

Edit `backend/.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agrismart
```

## 3. Install dependencies and run

```bash
cd backend
npm install
npm run dev   # or: npm start
```

