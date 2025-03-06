import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from "./Providers/Socket"; 
import { PeerProvider } from "./Providers/peer";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <><PeerProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
    </PeerProvider>
  </>
);

reportWebVitals();
