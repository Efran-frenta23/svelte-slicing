-- AutoPulse Database Schema v2.0
-- PostgreSQL with security improvements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    role VARCHAR(50) NOT NULL DEFAULT 'Member',
    email VARCHAR(255) NOT NULL,
    workshop VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('Member', 'Captain', 'Admin', 'Super Admin')),
    CONSTRAINT chk_status CHECK (status IN ('Active', 'Inactive'))
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_admin_role CHECK (role IN ('Admin', 'Super Admin'))
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
    price DECIMAL(15, 2),
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
    service_date TIMESTAMP WITH TIME ZONE,
    mileage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Details table
CREATE TABLE IF NOT EXISTS service_details (
    id SERIAL PRIMARY KEY,
    service_activity_id INTEGER REFERENCES service_activities(id) ON DELETE CASCADE,
    service_name VARCHAR(255),
    service_type VARCHAR(100),
    price DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id SERIAL PRIMARY KEY,
    service_activity_id INTEGER REFERENCES service_activities(id) ON DELETE CASCADE,
    service_item VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(15, 2),
    service_fee DECIMAL(15, 2),
    discount DECIMAL(15, 2) DEFAULT 0,
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

-- Finance table (improved decimal precision)
CREATE TABLE IF NOT EXISTS finance (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    transaction_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_transaction_type CHECK (transaction_type IN ('Income', 'Expense'))
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

-- Audit Log table (NEW for security)
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate Limit table (NEW for rate limiting)
CREATE TABLE IF NOT EXISTS rate_limit (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL UNIQUE,
    attempts INTEGER DEFAULT 0,
    first_attempt TIMESTAMP WITH TIME ZONE,
    last_attempt TIMESTAMP WITH TIME ZONE,
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance and security
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_captains_workshop ON captains(workshop);
CREATE INDEX IF NOT EXISTS idx_captains_employee_id ON captains(employee_id);
CREATE INDEX IF NOT EXISTS idx_cars_license_plate ON cars(license_plate);
CREATE INDEX IF NOT EXISTS idx_spareparts_workshop ON spareparts(workshop);
CREATE INDEX IF NOT EXISTS idx_spareparts_part_number ON spareparts(part_number);
CREATE INDEX IF NOT EXISTS idx_service_activities_branch ON service_activities(branch);
CREATE INDEX IF NOT EXISTS idx_service_activities_captain ON service_activities(captain_id);
CREATE INDEX IF NOT EXISTS idx_service_activities_status ON service_activities(status);
CREATE INDEX IF NOT EXISTS idx_service_details_activity ON service_details(service_activity_id);
CREATE INDEX IF NOT EXISTS idx_quotations_activity ON quotations(service_activity_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_finance_transaction_date ON finance(transaction_date);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_blocked ON rate_limit(blocked_until);

-- Insert default workshop data
INSERT INTO workshop (workshop_name, location, phone, email) VALUES
    ('Jakarta Branch', 'Jakarta, Indonesia', '+62-21-1234567', 'jakarta@autopulse.com'),
    ('Bandung Branch', 'Bandung, Indonesia', '+62-22-2345678', 'bandung@autopulse.com'),
    ('Surabaya Branch', 'Surabaya, Indonesia', '+62-31-3456789', 'surabaya@autopulse.com')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add more triggers for other tables as needed
