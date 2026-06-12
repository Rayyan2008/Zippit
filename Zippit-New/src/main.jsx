import React from 'react'; 
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CartProvider>
    <App />
  </CartProvider>
);

window.requestAnimationFrame(() => {
  const loader = document.getElementById('velour-loader');
  if (!loader) return;
  window.setTimeout(() => {
    loader.classList.add('loaded');
    window.setTimeout(() => {
      loader.parentNode && loader.parentNode.removeChild(loader);
    }, 700);
  }, 700);
});
