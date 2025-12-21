-- =========================================================
-- Database Schema
-- This file defines the backend database tables
-- used by the Student Management application.
-- Run once to initialize the database structure.
-- =========================================================

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    grade_id INT NOT NULL,
    teacher_notes VARCHAR(255),
    FOREIGN KEY (grade_id) REFERENCES grades(grade_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,
    teacher_name VARCHAR(255) NOT NULL,
    grade_id INT NOT NULL,
    UNIQUE (subject_name, grade_id),
    FOREIGN KEY (grade_id) REFERENCES grades(grade_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    exam_type VARCHAR(100),
    exam_date VARCHAR(20),
    grade_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grades(grade_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE student_subjects (
    aux_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    UNIQUE (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE exam_results (
    exam_index INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    exam_score INT,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
