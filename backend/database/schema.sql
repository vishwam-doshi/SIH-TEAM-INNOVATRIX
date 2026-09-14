-- =========================================================
-- AgriSmart AI - MySQL Database Schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS agrismart
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrismart;

-- ---------------------------------------------------------
-- users
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)      NOT NULL,
  email         VARCHAR(255)      NOT NULL,
  phone         VARCHAR(20)       NOT NULL,
  password      VARCHAR(255)      NOT NULL,   -- bcrypt hash
  created_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- sessions
-- Required by express-mysql-session, which replaces the
-- original connect-mongo session store.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  session_id  VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  expires     INT(11) UNSIGNED NOT NULL,
  data        MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
