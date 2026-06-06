import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SocietyDetails from './pages/SocietyDetails';
import AddSociety from './components/AddSociety';
import EditSociety from './components/EditSociety'; // 1. Import the new component
import AIRecommender from './pages/AIRecommender';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        
        {/* Details Page */}
        <Route path="/society/:id" element={<SocietyDetails />} />
        
        {/* Add Society Page */}
        <Route path="/add" element={<AddSociety />} />

        {/* 2. Edit Society Page (Dynamic Route) */}
        <Route path="/edit/:id" element={<EditSociety />} />

        <Route path="/ai-finder" element={<AIRecommender />} />
        
      </Routes>
    </div>
  );
}

export default App;