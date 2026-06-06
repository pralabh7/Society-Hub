import React from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
const SocietyCard = ({ id, name, type, head, status, contact, showAdminControls }) => {

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/societies/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          window.location.reload(); 
        } else {
          alert("Failed to delete the society.");
        }
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 m-4 w-80 flex flex-col justify-between">
      
      {/* 1. Admin Actions Group - Only visible if showAdminControls is true */}
      {showAdminControls && (
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
          {/* Edit Button */}
          <Link 
            to={`/edit/${id}`} 
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
            title="Edit Society"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Link>

          {/* Delete Button */}
          <button 
            onClick={handleDelete}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Remove Society"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {type}
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
              {name}
            </h3>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-gray-800">{head}</span>
          </div>

          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${status === 'Open' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className={`text-xs font-semibold ${status === 'Open' ? 'text-green-700' : 'text-gray-500'}`}>
              Recruitment {status}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Inquiries</span>
          <span className="text-xs font-mono text-gray-600">{contact}</span>
        </div>
        
        <Link to={`/society/${id}`}>
          <button className="bg-gray-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors group-hover:px-4">
            <span className="hidden group-hover:inline text-xs font-bold mr-1">View</span>
            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SocietyCard;