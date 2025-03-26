import React from 'react';
import ReactDOM from 'react-dom/client';
import { WorkoutAI } from './components/WorkoutAI';
import './styles/WorkoutAI.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WorkoutAI />
  </React.StrictMode>
); 