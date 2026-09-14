const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const { pool, connectDB } = require('../config/db');

dotenv.config();

const authRoutes = require('../routes/authRoutes');
const loginRoutes = require('../routes/loginroutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MySQL
connectDB();

app.use(cors({
  origin: 'http://localhost:8080', // React frontend origin
  credentials: true
}));
app.use(express.json());

// 🧠 Session middleware (MySQL-backed store, uses the `sessions` table)
const sessionStore = new MySQLStore({}, pool);

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // ✅ Replace with env-safe secret in prod
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false // set to true if HTTPS
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', loginRoutes);

app.get('/', (req, res) => {
  res.send('Server running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
