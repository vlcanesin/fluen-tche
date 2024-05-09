import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter'; // Import the AppRouter
import { AuthProvider } from './contexts/authContext'; // Import the Auth context
import Header from './components/header';

function App() {
  return (
    <AuthProvider> {/* Provide the Auth context to the whole app */}
      <BrowserRouter> {/* Wrap the application with BrowserRouter */}
        <div className='app-container'>
          <Header />    {/* Header that always appears */}
          <AppRouter /> {/* Define the routing structure */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
