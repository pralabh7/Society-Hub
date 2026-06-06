import API_BASE_URL from '../apiConfig';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocietyCard from '../components/SocietyCard';

function Home() {
  const [search, setSearch] = useState("");
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // 1. PERSISTENT LOGIN CHECK: Look for the secure JWT token instead of a simple flag string
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }

    // Fetch Society Data
    fetch(`${API_BASE_URL}/api/societies`)
      .then((res) => res.json())
      .then((data) => {
        setSocieties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // 2. UPDATED DYNAMIC AUTHENTICATION HANDLING
  const handleAdminToggle = async () => {
    if (isAdmin) {
      if (window.confirm("Are you sure you want to logout from Admin Mode?")) {
        setIsAdmin(false);
        // Clear tokens from the browser session storage
        localStorage.removeItem('adminToken');
      }
    } else {
      const inputPassword = prompt("Enter Admin Password:");
      if (!inputPassword) return; // Exit if user cancels dialog

      try {
        // Trigger API Call to your Express server matching the backend body schema
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: inputPassword })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsAdmin(true);
          // Store the authentic cryptographic JWT string securely
          localStorage.setItem('adminToken', data.token);
          alert(data.message || "Access Granted!");
        } else {
          // Display the custom message generated from backend catch block
          alert(data.message || "Authentication Failed!");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Server network error during authentication.");
      }
    }
  };

  const filteredClubs = societies.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || club.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Technical", "Cultural", "Sports", "Social"];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Admin Secret Toggle Bar */}
      <div className="bg-gray-900 py-2 px-4 flex justify-end items-center gap-3">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {isAdmin ? "Logged in as Administrator" : "Guest View Mode"}
        </span>
        <button 
          onClick={handleAdminToggle}
          className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
            isAdmin ? 'bg-green-500 text-white border-green-400' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
          }`}
        >
          {isAdmin ? "Admin: Logout" : "Admin: Login"}
        </button>
      </div>

      <header className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            NIT Bhopal <span className="text-blue-600">Society Hub</span>
          </h1>
          <p className="text-gray-500 mb-8 font-medium italic">Empowering MANITians to find their tribe.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <input 
              type="text"
              placeholder="Search for a club..."
              className="flex-1 px-5 py-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none transition-all shadow-sm bg-gray-50"
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-3 w-full md:w-auto">
              <Link to="/ai-finder" className="flex-1 md:flex-none">
                <button className="w-full whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <span>✨</span> Find My Society (AI)
                </button>
              </Link>

              {/* Add Society Button (Conditional view mapping based on state) */}
              {isAdmin && (
                <Link to="/add" className="flex-1 md:flex-none">
                  <button className="w-full whitespace-nowrap bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg transform active:scale-95">
                    + Add Club
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat ? "bg-gray-800 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl animate-pulse text-gray-300 font-bold">Syncing with NITB Database...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => (
                <SocietyCard 
                  key={club._id} 
                  id={club._id} 
                  name={club.name}
                  type={club.type}
                  head={club.head}
                  status={club.recruitmentStatus ? "Open" : "Closed"}
                  contact={club.contact}
                  showAdminControls={isAdmin} 
                />
              ))
            ) : (
              <div className="text-center py-20 w-full">
                <p className="text-gray-400 text-lg">Bhai, koi club nahi mila. Search check kar lo!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-10 text-gray-400 text-xs border-t border-gray-100 mt-auto bg-white">
        Built by Pralabh Mishra • CSE Student • NIT Bhopal
      </footer>
    </div>
  );
}

export default Home;