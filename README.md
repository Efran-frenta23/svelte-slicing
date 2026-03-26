# 🚗 AutoPulse - Workshop Management System

<div align="center">

![AutoPulse Banner](static/banner.png)

**A modern, professional workshop management system built with SvelteKit and Tailwind CSS**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the App](#running-the-app)
- [Usage](#-usage)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

**AutoPulse** is a comprehensive workshop management system designed to streamline automotive service operations. It provides tools for managing:

- 📊 **Dashboard** - Real-time overview of workshop operations
- 👥 **Member Management** - Track and manage customer memberships
- 👨‍✈️ **Captain Management** - Workshop staff coordination
- 🔧 **Service Management** - Service catalog and pricing
- 📝 **Service Activities** - Track service requests and status
- 🚗 **Car Management** - Vehicle database and specifications
- ⚙️ **Spare Parts** - Inventory management
- 💰 **Finance** - Transaction tracking and reporting
- 📢 **Promotions** - Marketing campaigns and discounts

### 🎨 Current Status

**⚠️ Under Active Development**

This project is currently undergoing a major UI/UX redesign to improve:
- Visual consistency and professional appearance
- Mobile responsiveness
- Accessibility (WCAG 2.1 AA compliance)
- User experience and workflow efficiency

**Current Version:** 1.0.0 (Legacy UI)  
**Target Version:** 2.0.0 (New Design System)

---

## ✨ Features

### Core Features

#### 📊 Dashboard
- Real-time statistics and metrics
- Quick access to common actions
- Recent activity overview
- Performance indicators

#### 👥 Customer Management
- Member database with detailed profiles
- Membership status tracking
- Customer history and interactions

#### 👨‍✈️ Staff Management
- Captain (workshop supervisor) assignment
- Role-based access control
- Staff performance tracking

#### 🔧 Service Management
- Comprehensive service catalog
- Service pricing and packages
- Activity tracking and status updates
- Service history per vehicle

#### 🚗 Vehicle Management
- Car brand and model database
- Vehicle specifications
- License plate tracking
- Service history per vehicle

#### ⚙️ Inventory Management
- Spare parts catalog
- Stock level tracking
- Brand management
- Supplier information

#### 💰 Financial Management
- Transaction recording
- Payment status tracking
- Revenue reporting
- Invoice generation

#### 📢 Marketing
- Promotion campaigns
- Discount management
- Seasonal offers

### 🔐 Security Features

- **Role-Based Access Control (RBAC)**
  - Super Admin (efran@dalang.io only)
  - Admin
  - Captain
  - Member
  
- **Session Management**
  - Redis-based sessions
  - Configurable session TTL
  - Secure cookie handling

- **Authentication**
  - Argon2id password hashing
  - Password breach detection
  - Rate limiting (5 attempts per 15 minutes)
  - CSRF protection

- **Audit Logging**
  - User action tracking
  - Session monitoring
  - Security event logging

---

## 🛠️ Tech Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Next-gen web framework
- **[Svelte 5](https://svelte.dev)** - Reactive UI framework
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[Font Awesome](https://fontawesome.com/)** - Icon library

### Backend
- **Node.js** - Runtime environment
- **PostgreSQL** - Primary database
- **Redis** - Session storage & caching
- **Express** - Server framework (via SvelteKit)

### Security & Performance
- **Argon2id** - Password hashing
- **Redis Sessions** - Fast session management
- **Rate Limiting** - DDoS protection
- **CSRF Protection** - Form security

### Development Tools
- **Vite** - Build tool & dev server
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
autopulse/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   └── Footer.svelte
│   │   ├── auth.js          # Authentication utilities
│   │   ├── db.js            # Database connection
│   │   ├── redis.js         # Redis connection
│   │   ├── password.js      # Password utilities
│   │   └── security.js      # Security utilities
│   │
│   ├── routes/
│   │   ├── api/             # REST API endpoints
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── Member/          # Member management
│   │   ├── Captain/         # Captain management
│   │   ├── Brand/           # Brand management
│   │   ├── Cars/            # Car management
│   │   ├── Service/         # Service management
│   │   ├── Workshop/        # Workshop management
│   │   ├── Sparepart/       # Spare parts management
│   │   ├── Finance/         # Financial management
│   │   ├── Logbook/         # Logbook
│   │   ├── promotion/       # Promotions
│   │   └── login/           # Authentication
│   │
│   ├── app.css              # Global styles
│   ├── app.html             # HTML template
│   └── hooks.server.js      # Server hooks
│
├── static/                   # Static assets
├── .env.example             # Environment template
├── docker-compose.yml       # Docker configuration
├── init.sql                 # Database schema
└── package.json             # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18+ or **Bun** v1.0+
- **PostgreSQL** v15+
- **Redis** v7+
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/autopulse.git
cd autopulse
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or using Bun
bun install
```

3. **Setup PostgreSQL Database**
```bash
# Create database
createdb autopulse

# Import schema
psql autopulse < init.sql
```

4. **Setup Redis**
```bash
# Using Docker
docker run -d -p 6379:6379 --name autopulse-redis redis:7

# Or install locally
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Environment Setup

1. **Copy environment template**
```bash
cp .env.example .env
```

2. **Update `.env` with your configuration**
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=autopulse

# Redis (default works with local Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
SESSION_SECRET=your-super-secret-key-change-in-production
BCRYPT_SALT_ROUNDS=12

# Server
NODE_ENV=development
PORT=5173
```

### Running the App

1. **Start development server**
```bash
npm run dev
# or
bun run dev
```

2. **Open in browser**
```
http://localhost:5173
```

3. **Default Login**
```
Email: efran@dalang.io
Password: (set during registration)
```

---

## 📖 Usage

### User Roles

#### Super Admin
- Full system access
- Can create Admin users
- View all workshops and data
- System configuration

#### Admin
- Manage workshop data
- Create/edit/delete Captains
- View all workshop reports
- Manage promotions

#### Captain
- View workshop information
- Manage service activities
- Update service status
- View member data

#### Member
- View personal information
- View service history
- View promotions
- Limited data access

### Key Workflows

#### Adding a New Member
1. Navigate to **Data Management → Member**
2. Click **Add Member**
3. Fill in member details
4. Save

#### Creating a Service Activity
1. Navigate to **Service**
2. Select a service
3. Click **View Activities**
4. Create new activity record

#### Managing Promotions
1. Navigate to **Promotion**
2. Click **Add Promotion**
3. Set discount percentage and dates
4. Activate promotion

---

## 👨‍💻 Development

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Database Migrations

```bash
# Create backup
pg_dump autopulse > backup.sql

# Apply changes
psql autopulse < migration_file.sql
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- src/lib/auth.test.js
```

---

## 🌐 Deployment

### Production Requirements

- **PostgreSQL** (production instance)
- **Redis** (production instance)
- **Node.js** v18+ runtime
- **Domain** with SSL certificate

### Deploy to Vercel

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel --prod
```

### Deploy to Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Deploy to Docker

```bash
# Build image
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📚 Documentation

### API Documentation

See [`API.md`](docs/API.md) for complete API reference.

### Architecture

See [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) for system architecture.

### UI/UX Audit

See [`PRD.md`](PRD.md) and [`README-UI-AUDIT.md`](README-UI-AUDIT.md) for UI/UX improvement plans.

### Contributing Guide

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure linting passes

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept constructive criticism
- Focus on what's best for the community

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 AutoPulse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **[Svelte Team](https://svelte.dev/)** - For the amazing Svelte framework
- **[Tailwind Labs](https://tailwindcss.com/)** - For Tailwind CSS
- **[PostgreSQL Team](https://www.postgresql.org/)** - For the powerful database
- **[Redis Labs](https://redis.io/)** - For Redis caching
- **All Contributors** - Thank you for your contributions!

---

## 📞 Support

- **Email**: efran@dalang.io
- **Issues**: [GitHub Issues](https://github.com/yourusername/autopulse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/autopulse/discussions)

---

<div align="center">

**Made with ❤️ by the AutoPulse Team**

⭐ Star this repo if you find it helpful!

</div>
