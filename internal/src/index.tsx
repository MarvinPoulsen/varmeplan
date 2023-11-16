import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app/App';
// import './index.scss';

const MOUNT_NODE = document.getElementById('root');
const root = createRoot(MOUNT_NODE as Element);
root.render(<App />);