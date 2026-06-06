import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
const AddSociety = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Technical',
    head: '',
    contact: '',
    description: '',
    images: '', // We'll take a string and convert it to an array for the backend
    recruitmentStatus: true
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert the single image URL string into the array format your schema expects
    const submissionData = {
      ...formData,
      images: [formData.images] 
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/societies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        alert("Society Added to NITB Hub!");
        navigate('/'); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error adding society:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <h2 className="text-3xl font-black mb-2 text-center text-gray-900">Add New Society</h2>
        <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-widest font-bold">Registration Portal</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Society Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Official Name</label>
            <input 
              className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g. ISTE NITB"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Category</label>
              <select 
                className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Social">Social</option>
              </select>
            </div>

            {/* Lead Head */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Current Head</label>
              <input 
                className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Full Name"
                onChange={(e) => setFormData({...formData, head: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Contact and Image URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Contact Email/Phone</label>
              <input 
                className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                placeholder="iste@manit.ac.in"
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Logo/Cover URL</label>
              <input 
                className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Paste image link here"
                onChange={(e) => setFormData({...formData, images: e.target.value})}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">About the Society</label>
            <textarea 
              rows="4"
              className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="What is the mission of this society?"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-blue-700 hover:shadow-blue-200 transition-all transform active:scale-95"
          >
            Register Society
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSociety;