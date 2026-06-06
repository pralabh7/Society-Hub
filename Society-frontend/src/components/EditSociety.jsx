import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

function EditSociety() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Technical',
    head: '',
    contact: '',
    recruitmentStatus: true,
    description: '',
    images: '' // We'll handle this as a string in the input
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/societies/${id}`)
      .then(res => res.json())
      .then(data => {
        // When loading, take the first image from the array to show in the input
        setFormData({
          ...data,
          images: data.images && data.images.length > 0 ? data.images[0] : ''
        });
      })
      .catch(err => console.error("Error fetching society:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for backend (convert images string back to array)
    const updatedData = {
      ...formData,
      images: [formData.images] 
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/societies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Changes saved successfully!");
        navigate('/'); 
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Edit <span className="text-blue-600">{formData.name}</span>
        </h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Management Portal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Society Name</label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            {/* Type/Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Social">Social</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Head Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Society Head</label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
                value={formData.head}
                onChange={(e) => setFormData({...formData, head: e.target.value})}
                required
              />
            </div>

            {/* Contact Field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Contact Details</label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Logo / Cover Image URL</label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
              placeholder="https://example.com/image.jpg"
              value={formData.images}
              onChange={(e) => setFormData({...formData, images: e.target.value})}
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">About the Society</label>
            <textarea 
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg transform active:scale-95"
            >
              Save Changes
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="px-8 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSociety;