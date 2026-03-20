-- AutoPulse Database Schema for PostgreSQL
-- Initialize database tables

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table (user profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    workshop VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    workshop VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Captains table
CREATE TABLE IF NOT EXISTS captains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    workshop VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    models TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(255),
    model VARCHAR(255),
    license_plate VARCHAR(20) UNIQUE,
    vin VARCHAR(50),
    owner VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spareparts table
CREATE TABLE IF NOT EXISTS spareparts (
    id SERIAL PRIMARY KEY,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100),
    brand VARCHAR(255),
    model_compatibility TEXT,
    price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    workshop VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Activities table
CREATE TABLE IF NOT EXISTS service_activities (
    id SERIAL PRIMARY KEY,
    activity_name VARCHAR(255) NOT NULL,
    branch VARCHAR(255),
    captain_id INTEGER REFERENCES captains(id),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Details table
CREATE TABLE IF NOT EXISTS service_details (
    id SERIAL PRIMARY KEY,
    service_activity_id INTEGER REFERENCES service_activities(id) ON DELETE CASCADE,
    service_name VARCHAR(255),
    service_type VARCHAR(100),
    price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id SERIAL PRIMARY KEY,
    service_activity_id INTEGER REFERENCES service_activities(id) ON DELETE CASCADE,
    item_name VARCHAR(255),
    quantity INTEGER,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    workshop VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Logbook table
CREATE TABLE IF NOT EXISTS logbook (
    id SERIAL PRIMARY KEY,
    activity_date DATE,
    description TEXT,
    captain_id INTEGER REFERENCES captains(id),
    vehicle_id INTEGER REFERENCES cars(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Finance table
CREATE TABLE IF NOT EXISTS finance (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50),
    amount DECIMAL(10, 2),
    description TEXT,
    category VARCHAR(100),
    transaction_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workshop table
CREATE TABLE IF NOT EXISTS workshop (
    id SERIAL PRIMARY KEY,
    workshop_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_captains_workshop ON captains(workshop);
CREATE INDEX IF NOT EXISTS idx_cars_license_plate ON cars(license_plate);
CREATE INDEX IF NOT EXISTS idx_spareparts_workshop ON spareparts(workshop);
CREATE INDEX IF NOT EXISTS idx_service_activities_branch ON service_activities(branch);

-- Insert default workshop data
INSERT INTO workshop (workshop_name, location, phone, email) VALUES
    ('Jakarta Branch', 'Jakarta, Indonesia', '+62-21-1234567', 'jakarta@autopulse.com'),
    ('Bandung Branch', 'Bandung, Indonesia', '+62-22-2345678', 'bandung@autopulse.com'),
    ('Surabaya Branch', 'Surabaya, Indonesia', '+62-31-3456789', 'surabaya@autopulse.com')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123 - hashed for demo)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password_hash) VALUES
    ('admin@autopulse.com', '$2b$10$YourHashedPasswordHere')
ON CONFLICT (email) DO NOTHING;
