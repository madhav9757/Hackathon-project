import React from 'react';
import AppRouter from './router'; 
import Navbar from './components/Navbar/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <main className="p-4">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;