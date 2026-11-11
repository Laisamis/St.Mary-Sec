-- ====================================================================
-- ST. MARY'S SECONDARY SCHOOL DATABASE SCHEMA (MICROSOFT ACCESS / JET / ACE)
-- Database File: st_marys_school.accdb
-- ====================================================================

-- 1. Students Table (tbl_Students)
CREATE TABLE tbl_Students (
    student_id AUTOINCREMENT PRIMARY KEY,
    admission_no VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATETIME NOT NULL,
    gender VARCHAR(15) NOT NULL,
    national_id VARCHAR(30),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address MEMO,
    form_class VARCHAR(20) NOT NULL,
    stream VARCHAR(20) DEFAULT 'East',
    study_mode VARCHAR(20) NOT NULL,
    previous_school VARCHAR(100),
    admission_year INTEGER NOT NULL,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    house VARCHAR(30) DEFAULT 'St. Patrick',
    club VARCHAR(50) DEFAULT 'Science Club',
    password_hash VARCHAR(255) NOT NULL,
    registered_at DATETIME DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'Active',
    fee_balance CURRENCY DEFAULT 0.00,
    total_fees CURRENCY DEFAULT 48000.00
);

-- 2. Administrators Table (tbl_Admins)
CREATE TABLE tbl_Admins (
    admin_id AUTOINCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_title VARCHAR(50) DEFAULT 'School Administrator',
    department VARCHAR(50) DEFAULT 'Principal Office',
    created_at DATETIME DEFAULT NOW()
);

-- 3. Academic Marks Table (tbl_Marks)
CREATE TABLE tbl_Marks (
    mark_id AUTOINCREMENT PRIMARY KEY,
    student_id INTEGER NOT NULL,
    academic_year INTEGER NOT NULL,
    term VARCHAR(15) NOT NULL,
    subject_code VARCHAR(10) NOT NULL,
    subject_name VARCHAR(60) NOT NULL,
    score DOUBLE NOT NULL,
    grade VARCHAR(4) NOT NULL,
    remarks VARCHAR(150),
    teacher_name VARCHAR(60)
);

-- 4. School Fees Ledger (tbl_Fees)
CREATE TABLE tbl_Fees (
    fee_id AUTOINCREMENT PRIMARY KEY,
    student_id INTEGER NOT NULL,
    receipt_no VARCHAR(30) NOT NULL,
    transaction_date DATETIME NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount CURRENCY NOT NULL,
    transaction_type VARCHAR(15) NOT NULL,
    balance_after CURRENCY NOT NULL
);

-- 5. School Announcements Table (tbl_Announcements)
CREATE TABLE tbl_Announcements (
    announcement_id AUTOINCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(30) NOT NULL,
    publish_date DATETIME NOT NULL,
    author VARCHAR(60) NOT NULL,
    content MEMO NOT NULL,
    is_important YESNO DEFAULT FALSE
);

-- Sample Administrator (Password: Admin123)
INSERT INTO tbl_Admins (full_name, email, password_hash, role_title)
VALUES ('Dr. Elizabeth Kiprono', 'admin@stmarys.ac.ke', '$2y$10$wN9v40L5l5.L5q0rS1Xq6OBcZ2VsmNlWpEaZk5sQ7j1nJ5aE6oK6u', 'Principal & Chief Administrator');
