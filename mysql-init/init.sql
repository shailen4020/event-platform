-- Event Platform Database Schema

CREATE DATABASE IF NOT EXISTS event_platform;
USE event_platform;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role ENUM('GUEST', 'ADMIN') DEFAULT 'GUEST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    submission_code VARCHAR(10),
    email_verified BOOLEAN DEFAULT FALSE,
    max_attendees INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (email, name, role) VALUES ('admin@eventplatform.com', 'Platform Admin', 'ADMIN')
ON DUPLICATE KEY UPDATE name = 'Platform Admin';

-- Insert some sample events
INSERT INTO events (title, description, category, location, event_date, organizer_name, organizer_email, status, email_verified) VALUES
('Tech Summit 2025', 'A premier technology conference featuring the latest innovations in AI, cloud computing, and software development. Join 500+ industry leaders.', 'Technology', 'Bangalore Convention Centre, MG Road', '2025-09-15 09:00:00', 'TechCorp India', 'contact@techcorp.in', 'APPROVED', TRUE),
('Startup Weekend Bengaluru', 'A 54-hour event where developers, designers, marketers and startup enthusiasts come together to build amazing startups.', 'Business', 'WeWork Galaxy, Residency Road', '2025-08-20 18:00:00', 'Startup India', 'hello@startupindia.org', 'APPROVED', TRUE),
('Carnatic Music Festival', 'Three days of classical Carnatic music performances by renowned artists from across South India.', 'Music', 'Chowdaiah Memorial Hall, Gayathri Devi Park', '2025-07-10 17:00:00', 'Karnataka Sangeetha Sabha', 'info@kss.org', 'APPROVED', TRUE),
('Bengaluru Food Fest', 'Celebrate the diverse culinary heritage of Bengaluru with 100+ food stalls, live cooking demos and food competitions.', 'Food', 'Palace Grounds, Jayamahal Road', '2025-10-05 11:00:00', 'Foodie Events', 'organizer@foodiefest.in', 'APPROVED', TRUE),
('Design Thinking Workshop', 'An intensive 2-day workshop on human-centered design principles and creative problem solving.', 'Workshop', 'IISc Campus, Malleshwaram', '2025-08-01 10:00:00', 'Design Hub', 'workshop@designhub.co', 'APPROVED', TRUE);
