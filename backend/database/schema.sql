-- =========================================================
-- AgriSmart AI - MySQL Database Schema
-- Converted from the original MongoDB/Mongoose models
-- =========================================================

CREATE DATABASE IF NOT EXISTS agrismart
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrismart;

-- ---------------------------------------------------------
-- users
-- The original project had two Mongoose models (User and
-- login_user) that both mapped to the same "users" Mongo
-- collection. This single table replaces both.
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

INSERT INTO users (id, name, email, phone, password, created_at, updated_at) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', '9000000001', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(2, 'Priya Patel', 'priya.patel@example.com', '9000000002', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(3, 'Arjun Mehta', 'arjun.mehta@example.com', '9000000003', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(4, 'Neha Shah', 'neha.shah@example.com', '9000000004', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(5, 'Rohan Das', 'rohan.das@example.com', '9000000005', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(6, 'Amit Verma', 'amit.verma@example.com', '9000000006', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(7, 'Sneha Joshi', 'sneha.joshi@example.com', '9000000007', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(8, 'Vikram Singh', 'vikram.singh@example.com', '9000000008', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(9, 'Ananya Rao', 'ananya.rao@example.com', '9000000009', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34'),
(10, 'Karan Gupta', 'karan.gupta@example.com', '9000000010', '$2b$10$NfpIR2J0e2UI5VGcLKrMy.1TSGKdxVQEmjXVcwHIcQv...', '2026-09-14 17:50:34', '2026-09-14 17:50:34');
