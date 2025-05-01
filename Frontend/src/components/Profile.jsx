import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]); // Track matched users
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/random-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.users); // Assuming backend returns { users: [...] }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = async (targetUserId) => {
    const token = localStorage.getItem("token");
    setLoadingLike(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/like`,
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = response.data.message;

      if (message === "You already liked this user") {
        // Already liked → remove from list
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== targetUserId));
      } else if (message === "User liked successfully") {
        // Liked successfully → remove from list
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== targetUserId));
      } else if (message === "Match found!") {
        // It's a match! → mark this user as matched
        setMatchedUsers((prev) => [...prev, targetUserId]);
      }
    } catch (error) {
      console.error("Error liking user:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleChat = (userId) => {
    // You can later navigate to chat page with that user
    alert(`Starting chat with user: ${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Meet New People</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            {user.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
            )}
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{user.gender}</p>

            {matchedUsers.includes(user._id) ? (
              <button
                onClick={() => handleChat(user._id)}
                className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
              >
                Chat 💬
              </button>
            ) : (
              <button
                onClick={() => handleLike(user._id)}
                disabled={loadingLike}
                className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full"
              >
                {loadingLike ? "Processing..." : "Like ❤️"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
