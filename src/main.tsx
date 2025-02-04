import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
const container = document.getElementById('root');

// Create a root instance
const root = createRoot(container!); // The '!' asserts container exists

// Render your app
root.render(<App />);