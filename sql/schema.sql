// Main React file structure and backend setup using MySQL will go here.
// Since this is a full project, the setup will be divided into:
// - React frontend (React + CSS)
// - Node.js backend (Express + MySQL)
// - DB schema setup
// - Sample styling (college-themed)
// - Sample logo placement

// Folder Structure
// /client
//    /public
//       - index.html
//       - logo.png (Ramaiah logo)
//    /src
//       - App.js
//       - components/
//          - Login.js
//          - Feedback.js
//          - StudentDashboard.js
//          - VendorDashboard.js
//          - QueueCard.js
//       - styles/
//          - main.css
// /server
//    - index.js
//    - routes/
//       - auth.js
//       - queue.js
//       - vendor.js
//    - config/
//       - db.js
// /sql
//    - schema.sql

// --- /sql/schema.sql ---
/* SQL schema for QueueBot using MySQL */

CREATE TABLE shops (
  shop_number INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
  usn VARCHAR(20) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  semester VARCHAR(10),
  role ENUM('student', 'vendor') NOT NULL,
  shop_number INT,
  FOREIGN KEY (shop_number) REFERENCES shops(shop_number) ON DELETE SET NULL
);

CREATE TABLE queues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_usn VARCHAR(20),
  shop_number INT,
  file_name VARCHAR(255) NOT NULL,
  estimated_time INT DEFAULT 5,
  status ENUM('pending', 'done') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_usn) REFERENCES users(usn) ON DELETE CASCADE,
  FOREIGN KEY (shop_number) REFERENCES shops(shop_number) ON DELETE CASCADE
);

CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_usn VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_usn) REFERENCES users(usn) ON DELETE SET NULL
);

-- Insert five stationary shops
INSERT INTO shops (shop_number, name) VALUES 
(1, 'Stationery Shop 1'),
(2, 'Stationery Shop 2'),
(3, 'Stationery Shop 3'),
(4, 'Stationery Shop 4'),
(5, 'Stationery Shop 5');
CREATE TABLE print_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255),
  usn VARCHAR(50),
  shop_number INT,
  status VARCHAR(20),
  submitted_at DATETIME
);

-- Next steps: backend configuration and routes.
