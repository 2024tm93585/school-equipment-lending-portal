-- Create database if not exists
CREATE DATABASE IF NOT EXISTS equipment_portal;
USE equipment_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('student', 'staff', 'administrator') NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    default_lending_days INT NOT NULL DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment items table
CREATE TABLE IF NOT EXISTS equipment_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    available_quantity INT NOT NULL DEFAULT 1,
    status ENUM('available', 'checked_out', 'under_maintenance', 'retired') 
        NOT NULL DEFAULT 'available',
    condition_status ENUM('excellent', 'good', 'fair', 'poor', 'damaged') 
        NOT NULL DEFAULT 'good',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_serial_number (serial_number),
    INDEX idx_status (status),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Borrow requests table
CREATE TABLE IF NOT EXISTS borrow_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    equipment_id INT NOT NULL,
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose TEXT,
    status ENUM('pending', 'approved', 'rejected', 'returned') NOT NULL DEFAULT 'pending',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    returned_at TIMESTAMP NULL,
    return_condition ENUM('excellent', 'good', 'fair', 'poor', 'damaged') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (equipment_id) REFERENCES equipment_items(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_equipment_id (equipment_id),
    INDEX idx_status (status),
    INDEX idx_date_range (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO categories (name, description, default_lending_days) VALUES
('Laptops', 'Portable computers for student use', 7),
('Tablets', 'iPad and Android tablets', 7),
('Projectors', 'Presentation projectors', 3),
('Lab Equipment', 'Scientific and technical lab equipment', 14),
('Cameras', 'Digital cameras and video equipment', 5),
('Audio Equipment', 'Microphones, speakers, and audio devices', 3);

-- Insert default admin user (password: Admin123!)
-- Password hash for 'Admin123!' using bcrypt
INSERT INTO users (email, password_hash, name, role, is_active) VALUES
('admin@school.edu', '$2b$12$PmPu2pq8DUKOKUO4haDYUeP7o345DY8/3XyH1ioc.o98h.t6kv18i', 'System Administrator', 'administrator', TRUE);

-- Insert sample equipment
INSERT INTO equipment_items (name, serial_number, description, category_id, quantity, available_quantity, status, condition_status) VALUES
('MacBook Pro 16"', 'MBP-2023-001', '16-inch MacBook Pro with M2 chip, 16GB RAM', 1, 1, 1, 'available', 'excellent'),
('MacBook Air 13"', 'MBA-2023-001', '13-inch MacBook Air with M2 chip, 8GB RAM', 1, 1, 1, 'available', 'good'),
('Dell XPS 15', 'DELL-2023-001', 'Dell XPS 15 with Intel i7, 16GB RAM', 1, 1, 1, 'available', 'excellent'),
('iPad Pro 12.9"', 'IPD-2023-001', '12.9-inch iPad Pro with Apple Pencil', 2, 1, 1, 'available', 'excellent'),
('iPad Air', 'IPA-2023-001', '10.9-inch iPad Air with keyboard', 2, 1, 1, 'available', 'good'),
('Epson Projector', 'PROJ-2023-001', 'Epson PowerLite 3LCD projector, 3600 lumens', 3, 1, 1, 'available', 'good'),
('BenQ Projector', 'PROJ-2023-002', 'BenQ DLP projector, 4000 lumens', 3, 1, 1, 'available', 'excellent'),
('Oscilloscope', 'OSC-2023-001', 'Digital oscilloscope 100MHz', 4, 1, 1, 'available', 'excellent'),
('Multimeter', 'MULT-2023-001', 'Fluke digital multimeter', 4, 1, 1, 'available', 'good'),
('Canon DSLR', 'CAM-2023-001', 'Canon EOS 90D with 18-135mm lens', 5, 1, 1, 'available', 'excellent');
