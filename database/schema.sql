-- EverTales AI — Database Schema

CREATE DATABASE IF NOT EXISTS evertales_ai;
USE evertales_ai;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Stories (
    story_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    story_date DATE,
    category_id INT,
    transcript TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

CREATE TABLE Media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    media_type ENUM('image', 'audio') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (story_id) REFERENCES Stories(story_id) ON DELETE CASCADE
);

CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (story_id) REFERENCES Stories(story_id) ON DELETE CASCADE
);

-- Seed a few default categories
INSERT INTO Categories (category_name) VALUES
    ('Family'), ('Travel'), ('Education'), ('Career'), ('Achievements'), ('Personal'), 
    ('Relationships & Love'), ('Moments & Milestones');
