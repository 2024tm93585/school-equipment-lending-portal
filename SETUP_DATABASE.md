# Database Setup Guide

This guide will help you set up the MySQL database for the School Equipment Lending Portal.

## Option 1: Automatic Setup (Recommended)

Run the startup script which will automatically create and initialize the database:

**macOS/Linux:**
```bash
./start-local.sh
```

**Windows:**
```bash
start-local.bat
```

## Option 2: Manual Setup

### Step 1: Connect to MySQL

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 2: Create Database and User

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS equipment_portal;

-- Create a dedicated user for the application
CREATE USER IF NOT EXISTS 'portal_user'@'localhost' IDENTIFIED BY 'portal_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON equipment_portal.* TO 'portal_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 3: Initialize Database Schema and Data

Run the initialization script from the terminal:

```bash
mysql -u root -p equipment_portal < backend/init.sql
```

Or if you prefer to use the portal_user:

```bash
mysql -u portal_user -pportal_password equipment_portal < backend/init.sql
```

### Step 4: Verify Database Setup

```bash
mysql -u portal_user -pportal_password equipment_portal -e "SHOW TABLES;"
```

You should see:
- borrow_requests
- categories
- equipment_items
- users

### Step 5: Verify Sample Data

Check users:
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, email, name, role FROM users;"
```

Check equipment:
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, name, status FROM equipment_items;"
```

Check categories:
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, name FROM categories;"
```

## Using Different Database Credentials

If you want to use different database credentials:

1. **Update the database creation commands** with your preferred username and password

2. **Update backend/.env file:**
   ```
   DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/equipment_portal
   ```

3. **Run the initialization script** with your credentials

## Troubleshooting

### Error: Access denied for user 'root'@'localhost'

**Solution:** Make sure you're using the correct MySQL root password.

### Error: Unknown database 'equipment_portal'

**Solution:** The database hasn't been created yet. Run the CREATE DATABASE command.

### Error: Table 'users' already exists

**Solution:** The database has already been initialized. If you want to reset it:

```bash
mysql -u root -p -e "DROP DATABASE equipment_portal;"
mysql -u root -p -e "CREATE DATABASE equipment_portal;"
mysql -u root -p equipment_portal < backend/init.sql
```

### Error: Can't connect to MySQL server

**Solution:** 
1. Check if MySQL is running:
   - macOS: `brew services list | grep mysql`
   - Linux: `sudo systemctl status mysql`
   - Windows: Check Services app for MySQL service

2. Start MySQL if it's not running:
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`
   - Windows: Start MySQL service from Services app

### Checking MySQL Connection

Test your MySQL connection:

```bash
mysql -u root -p -e "SELECT VERSION();"
```

This should display your MySQL version if the connection is successful.

## Database Schema Overview

### Tables

1. **users** - Stores user accounts (students, staff, administrators)
2. **categories** - Equipment categories (Laptops, Tablets, etc.)
3. **equipment_items** - Individual equipment items
4. **borrow_requests** - Borrowing requests and their status

### Default Data

- **1 Admin User:** admin@school.edu / Admin123!
- **6 Categories:** Laptops, Tablets, Projectors, Lab Equipment, Cameras, Audio Equipment
- **10 Equipment Items:** Various laptops, tablets, projectors, and lab equipment

## Security Notes

⚠️ **Important for Production:**

1. Change the default password for 'portal_user'
2. Use strong passwords
3. Don't commit .env files with real credentials to version control
4. Consider using environment variables instead of .env files in production
5. Regularly backup your database
6. Limit database user privileges to only what's needed
