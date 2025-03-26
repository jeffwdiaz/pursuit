# Development Environment Setup Guide

## Prerequisites
1. Install Homebrew (macOS package manager)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Node.js and npm
   ```bash
   brew install node
   ```

## Project Setup
1. Navigate to the project directory
   ```bash
   cd builds/001_lifting
   ```

2. Initialize the project and install dependencies
   ```bash
   npm init -y
   npm install react react-dom @types/react @types/react-dom typescript @vitejs/plugin-react vite @google/generative-ai @types/node
   ```

3. Create a `tsconfig.json` file with TypeScript configuration
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

4. Create a `vite.config.ts` file
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
   })
   ```

5. Create a `.env` file in the project root
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. Update your `package.json` scripts
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview"
     }
   }
   ```

## Running the Project
1. Start the development server
   ```bash
   npm run dev
   ```

2. Build for production
   ```bash
   npm run build
   ```

## Project Structure
```
001_lifting/
├── src/
│   ├── components/     # React components
│   │   └── WorkoutAI.tsx
│   ├── services/      # API services
│   │   └── geminiService.ts
│   ├── styles/        # CSS files
│   │   └── WorkoutAI.css
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Gemini AI Setup
1. Get a Gemini API key from Google AI Studio (https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root
3. Add your API key to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Notes
- The project uses Vite as the build tool for fast development
- TypeScript is configured for type safety
- React 18+ is used with modern features
- CSS modules are supported out of the box
- Gemini AI is integrated for workout plan generation 