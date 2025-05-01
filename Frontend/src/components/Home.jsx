import React, { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./Logout";

const Home = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Home</h2>
        {user ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-700">Welcome, {user.name}!</h3>
            <p className="text-lg text-gray-600">Email: {user.email}</p>
            {/* You can add more user details here */}
          </div>
        ) : (
          <p className="text-xl text-gray-500">Loading...</p>
        )}
        <div className="mt-6">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Home;
