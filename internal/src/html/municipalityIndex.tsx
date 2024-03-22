import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../pages/Municipality';
import '../sharedStyles.scss';

const MOUNT_NODE = document.getElementById('municipality');
const root = createRoot(MOUNT_NODE as Element);
root.render(<App />);
