import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MatchedUsers = () => {
  const navigate = useNavigate();

  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch matched users from API
    const fetchMatchedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/matched-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMatchedUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matched users", error);
        setLoading(false);
      }
    };

    fetchMatchedUsers();
  }, []);

  const handleStartChat = (user) => {
    navigate(`/chat/${user._id}`, { state: { user } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Matched Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matchedUsers.length === 0 ? (
        <p>No matches found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedUsers.map((user) => (
            <div key={user._id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${
                  user.profilePicture
                }`}
                alt={user.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <h2 className="text-lg font-semibold mt-2">{user.name}</h2>
              <p>{user.bio || "No bio available"}</p>
              <button
                onClick={() => handleStartChat(user)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
              >
                Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchedUsers;
