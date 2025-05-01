import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleStartChat = () => {
    navigate(`/matched-users`);
  };

  const handleStartExplore = () => {
    navigate(`/profile`);
  };

  const handleStartEdit = () => {
    navigate(`/UserProfile`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Welcome Home
        </h2>
        {user ? (
          <div className="space-y-4 text-center">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${
                user.profilePicture
              }`}
              alt="User  Avatar"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />
            <h3 className="text-3xl font-semibold text-gray-700">
              Hello, {user.name}!
            </h3>
            <p className="text-lg text-gray-600">
              Email: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        ) : (
          <p className="text-xl text-gray-500 animate-pulse">Loading...</p>
        )}
        <div className="mt-8 flex justify-around">
         
          <button
            onClick={() => handleStartExplore()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Explore
          </button>
          <button
            onClick={() => handleStartEdit()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition duration-300"
          >
            Edit
          </button>
          <button
            onClick={() => handleStartChat()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition duration-300"
          >
            Matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
