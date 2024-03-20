import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../pages/CottageAreas';
import '../index.scss';

const MOUNT_NODE = document.getElementById('cottage-area');
const root = createRoot(MOUNT_NODE as Element);
root.render(<App />);
