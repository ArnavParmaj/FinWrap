# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FinWrap is a personal finance management application built with React, TypeScript, and Firebase. It features transaction tracking, budget management, financial goals, spending insights, and CSV import functionality.

## Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling with custom configurations
- **Zustand** for state management
- **React Router** for navigation
- **Recharts** for data visualization
- **Firebase** for backend services (Auth, Firestore, Storage)

### Backend Services
- **Firebase Authentication** for user management
- **Cloud Firestore** for data storage
- **Firebase Storage** for file storage (currently minimal usage)

### State Management
- **Zustand Stores**:
  - `useUserStore` - Manages user authentication state and settings
  - `useAppStore` - Manages global app state (sidebar, active month)
- **Custom Hooks**: Encapsulate Firebase logic (`useTransactions`, `useBudgets`, `useAuth`)

### Component Structure
- **Pages**: Located in `src/pages/` - Each represents a route in the application
- **Components**: Located in `src/components/` - Reusable UI components
- **Hooks**: Located in `src/hooks/` - Custom React hooks for data fetching and business logic
- **Stores**: Located in `src/store/` - Zustand state management stores
- **Lib**: Located in `src/lib/` - Utility functions and service integrations
- **Assets**: Located in `src/assets/` - Static assets like images and icons

## Common Development Tasks

### Running the Application
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
```

### Code Quality
```bash
npm run lint      # Run ESLint
```

### Testing
Currently no automated testing framework configured. Manual testing through UI interaction.

### Project-Specific Conventions
- **Currency Formatting**: Use `formatINR()` from `src/lib/dashboardStats.ts`
- **Date Handling**: Use consistent date formats (YYYY-MM-DD)
- **Component Styling**: Use Tailwind classes with custom theme variables
- **Firebase Integration**: Use existing hooks pattern for data operations
- **Type Safety**: Maintain strict TypeScript typing throughout

### Key Files and Directories
- `src/App.tsx` - Main application router and layout
- `src/components/Layout.tsx` - Main application layout with sidebar
- `src/pages/Transactions.tsx` - Core transaction management interface
- `src/hooks/useTransactions.ts` - Firebase integration for transactions
- `src/lib/firebase.ts` - Firebase initialization and configuration
- `src/store/` - Global state management with Zustand
- `src/types.ts` - Shared TypeScript interfaces and types

### Data Flow Patterns
1. **Authentication**: Firebase Auth → `useAuth` hook → `useUserStore`
2. **Data Fetching**: Firebase Firestore → Custom hooks → React components
3. **State Management**: Zustand stores for global state persistence
4. **UI Updates**: Real-time updates through Firebase snapshot listeners

### Styling System
- **Tailwind CSS** with custom configuration in `src/index.css`
- **Dark Theme** as default with custom color variables
- **Glass Morphism Effects** using `.glass-card` utility class
- **Material Icons** for iconography throughout the application

### Environment Variables
Required environment variables for Firebase configuration:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

These should be defined in a `.env.local` file in the `web/` directory.