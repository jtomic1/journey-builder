# Journey Builder - Avantos Coding Challenge

A Next/React application for visualizing and managing form field mappings through an interactive graph interface.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### 1. Start the Backend Simulator

**IMPORTANT**: Start the backend server first before running the React application.

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm start
```

The backend server runs on `http://localhost:3000` by default.

### 2. Start the Next Application

In a new terminal:

```bash
cd journey-builder
npm install
npm start
```

The Next/React app runs on `http://localhost:3001` by default.

### 🔧 Port Configuration

The Next/React app is configured to run on port **3001** by default. If you need a different port:

```bash
npm run start:3000  # Port 3000
npm run start:3002  # Port 3002
```

## 📋 Available Scripts

### React App (challenge-react-app)
- `npm start` - Runs the app in development mode (port 3001)
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## 🎯 What This App Does

This application visualizes form field mappings through an interactive graph:

1. **View Form Dependencies**: Interactive graph showing relationships between forms
2. **Map Form Fields**: Click nodes to map form fields to data sources
3. **Manage Mappings**: Add, remove, and modify field mappings
4. **Real-time Updates**: See changes reflected immediately in the graph

## 🔧 Technology Stack
- **React** with **TypeScript**
- **Next.js** for SSR, routing and React app development
- **Redux Toolkit** for state management
- **React Flow** for graph visualization
- **PrimeReact and PrimeIcons** for UI components
- **TanStack Query** for API integration
- **Jest** for testing

## 🔍 Troubleshooting

### Common Issues

1. **Graph Not Loading**
   - Ensure backend server is running on port 3001

2. **Port Conflicts**
   - If port 3001 is in use, try `npm run start:3002`

3. **Tests Failing**
   - Run `npm install` to ensure dependencies are installed
   - Check for TypeScript compilation errors

---

**⚠️ Important**: Always start the backend simulator (`frontendchallengeserver`) before running the React application (`challenge-react-app`).
