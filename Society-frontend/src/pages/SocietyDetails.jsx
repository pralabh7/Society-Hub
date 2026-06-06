import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
const SocietyDetails = () => {
  const { id } = useParams(); 
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/societies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSociety(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen font-bold text-gray-400 animate-pulse">Loading Society details...</div>;
  if (!society) return <div className="p-10 text-center text-red-500 font-bold">Society not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Navigation Header */}
      <nav className="bg-white border-b px-6 py-4 mb-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2 transition-colors">
            ← Back to Hub
          </Link>
        </div>
      </nav>
      
      <div className="max-w-5xl mx-auto px-4">
        {/* 2. Hero Section - Optimized for Original Resolution Logos */}
        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl mb-10 bg-white border border-gray-100">
          <img 
            src={society.images && society.images[0] ? society.images[0] : "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070"} 
            alt={society.name}
            /* 'object-contain' preserves original aspect ratio without cropping */
            className="w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105"
          />
          
          {/* Subtle Overlay for the bottom text */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent pt-20 pb-8 px-8">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
              {society.type}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
              {society.name}
            </h1>
          </div>
        </div>

        {/* 3. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main About Section */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-4 border-b border-gray-50 pb-2">About the Society</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {society.description || "The society hasn't added a description yet. Check back soon for updates on their vision and mission at MANIT."}
              </p>
            </section>

            {/* Gallery Section for additional photos */}
            {society.images && society.images.length > 1 && (
              <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Society Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {society.images.slice(1).map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      className="rounded-2xl h-48 w-full object-cover hover:shadow-lg transition-shadow cursor-pointer border border-gray-50" 
                      alt={`Gallery ${index}`} 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-8 border-b border-gray-50 pb-2">Society Pulse</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 font-bold text-xl shadow-sm">👤</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Lead Coordinator</p>
                    <p className="text-gray-900 font-extrabold text-lg">{society.head}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl font-bold text-xl shadow-sm ${society.recruitmentStatus ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {society.recruitmentStatus ? '🚀' : '🛑'}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Hiring Status</p>
                    <p className={`font-extrabold text-lg ${society.recruitmentStatus ? 'text-green-600' : 'text-red-600'}`}>
                      {society.recruitmentStatus ? "Open Now" : "Closed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 font-bold text-xl shadow-sm">📧</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Contact Channel</p>
                    <p className="text-gray-900 font-mono text-sm break-all font-semibold">{society.contact || "Visit MANIT Campus"}</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-10 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-600 transition-all uppercase tracking-widest text-xs transform active:scale-95">
                Apply for Membership
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetails;