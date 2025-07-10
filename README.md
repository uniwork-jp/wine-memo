# Wine Memo 🍷

A modern wine tasting and management application built with Next.js, Firebase, and TypeScript. Track your wine experiences with detailed characteristics, ratings, and notes in a beautiful, responsive Progressive Web App.

## 🏗️ Architecture

### Monorepo Structure
This project uses a **monorepo architecture** with pnpm workspaces and Turbo for efficient build orchestration:

```
wine-memo/
├── apps/
│   ├── user-ui/          # Main user-facing PWA application
│   └── admin-ui/         # Admin dashboard for user management
├── packages/
│   ├── firebase/         # Shared Firebase client/server utilities
│   └── schemas/          # Shared Zod validation schemas
├── infra/
│   └── firebase/         # Terraform infrastructure as code
└── lib/                  # Shared utilities and configurations
```

### Technology Stack

#### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Mantine UI** - Modern component library with Japanese localization
- **Tailwind CSS 4** - Utility-first CSS framework
- **PWA** - Progressive Web App with offline support

#### Backend & Database
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Admin SDK** - Server-side Firebase operations
- **Next.js API Routes** - Serverless API endpoints

#### Infrastructure
- **Terraform** - Infrastructure as Code for Firebase resources
- **Firebase Hosting** - Static site hosting
- **Firebase Security Rules** - Database access control

#### Development Tools
- **Turbo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Zod** - Runtime type validation

## 🚀 Core Features

### Wine Management
- **Wine Recording** - Add new wines with detailed characteristics
- **Radar Charts** - Visual representation of wine characteristics (sweetness, body, acidity, tannin, bitterness)
- **Rating System** - 1-5 star rating with notes
- **Search & Filter** - Find wines by characteristics, region, grape variety
- **CRUD Operations** - Create, read, update, delete wine records

### User Experience
- **Progressive Web App** - Installable on mobile and desktop
- **Offline Support** - Basic offline functionality with service workers
- **Responsive Design** - Optimized for all screen sizes
- **Japanese Localization** - Full Japanese language support
- **Real-time Updates** - Live data synchronization

### Data Validation
- **Zod Schemas** - Runtime type validation for all API endpoints
- **Type Safety** - Full TypeScript coverage across the stack
- **Error Handling** - Comprehensive error management

## 📦 Core Libraries

### Frontend Libraries
```json
{
  "@mantine/core": "^8.1.3",           // UI component library
  "@mantine/form": "^8.1.3",           // Form management
  "@mantine/hooks": "^8.1.3",          // Custom React hooks
  "@mantine/notifications": "^8.1.3",  // Toast notifications
  "@tabler/icons-react": "^3.34.0",    // Icon library
  "next-pwa": "^5.6.0",                // PWA support
  "react": "^19.0.0",                  // React library
  "next": "15.3.5"                     // Next.js framework
}
```

### Backend Libraries
```json
{
  "firebase": "^11.10.0",              // Firebase client SDK
  "firebase-admin": "^12.0.0",         // Firebase admin SDK
  "zod": "^3.25.75"                    // Schema validation
}
```

### Development Libraries
```json
{
  "turbo": "2.5.4",                    // Monorepo build system
  "typescript": "^5.8.3",              // TypeScript compiler
  "tailwindcss": "^4.1.11",            // CSS framework
  "eslint": "^9.30.1",                 // Code linting
  "prettier": "^3.0.0"                 // Code formatting
}
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm 8.15.0+
- Firebase project
- Google Cloud account (for Terraform)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wine-memo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   ```bash
   # Copy environment template
   cp infra/firebase/terraform.tfvars.example infra/firebase/terraform.tfvars
   
   # Edit terraform.tfvars with your project details
   # Deploy infrastructure
   cd infra/firebase
   terraform init
   terraform plan
   terraform apply
   ```

4. **Configure environment variables**
   ```bash
   # Copy and configure environment variables
   cp .env.example .env.local
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages and apps
pnpm clean            # Clean all build artifacts

# Infrastructure
pnpm generate-indexes # Generate Firestore indexes from schemas
pnpm generate-indexes-safe # Safe index generation with validation

# Formatting
pnpm format           # Format code with Prettier
```

## 🏛️ Project Structure

### Apps
- **`apps/user-ui/`** - Main wine management PWA
  - `app/` - Next.js App Router pages and API routes
  - `components/` - Reusable React components
  - `public/` - Static assets and PWA files

- **`apps/admin-ui/`** - Admin dashboard
  - User management interface
  - Analytics and statistics

### Packages
- **`packages/firebase/`** - Firebase utilities
  - Client and server Firebase configurations
  - Shared Firebase operations

- **`packages/schemas/`** - Data validation schemas
  - Zod schemas for wine data
  - TypeScript type definitions

### Infrastructure
- **`infra/firebase/`** - Terraform configurations
  - Firebase project setup
  - Firestore database configuration
  - Security rules and indexes

## 🔧 Development

### Adding New Features

1. **Create Zod schemas** in `packages/schemas/`
2. **Add API routes** in `apps/user-ui/app/api/`
3. **Create UI components** in `apps/user-ui/components/`
4. **Update types** and regenerate indexes if needed

### Code Quality

- **TypeScript** - All code is fully typed
- **ESLint** - Code linting with Next.js rules
- **Prettier** - Consistent code formatting
- **Zod validation** - Runtime type checking

### Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build verification
pnpm build
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Build the application
pnpm build

# Deploy to Firebase
firebase deploy
```

### Infrastructure Updates
```bash
cd infra/firebase
terraform plan
terraform apply
```

## 📱 PWA Features

The user interface is built as a Progressive Web App with:

- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Basic offline functionality
- **App-like Experience** - Standalone mode without browser UI
- **Push Notifications** - Ready for future implementation
- **Responsive Design** - Optimized for all devices

See `apps/user-ui/PWA_README.md` for detailed PWA setup and customization.

## 🔐 Security

- **Firebase Security Rules** - Database access control
- **Input Validation** - Zod schemas for all API endpoints
- **Type Safety** - TypeScript prevents runtime errors
- **Environment Variables** - Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using modern web technologies for the ultimate wine tasting experience.
