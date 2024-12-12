/**
 * Import necessary dependencies from React and React DOM.
 * 
 * @see https://reactjs.org/docs/strict-mode.html
 * @see https://reactjs.org/docs/react-dom-client.html
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Import the main application component.
 * 
 * @see ./App.tsx
 */
import App from './App.tsx';

/**
 * Import global CSS styles for the application.
 * 
 * @see ./index.css
 */
import './index.css';


/**
 * Create a root element for the React application and render it to the DOM.
 * 
 * The `createRoot` method is used to create a new root element for the application,
 * and the `render` method is used to render the application to the DOM.
 * 
 * The `StrictMode` component is used to enable strict mode for the application,
 * which provides additional warnings and checks for potential issues.
 * 
 * @example
 * // Create a new root element and render the application to the DOM
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>,
 * );
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


