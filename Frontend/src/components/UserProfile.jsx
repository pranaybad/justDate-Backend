import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    profilePicture: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return;

    setUploading(true);

    try {
      // If a new profile image is selected, upload it first
      if (profileImage) {
        const formData = new FormData();
        formData.append("profilePicture", profileImage);

        const uploadResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/upload-profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (uploadResponse.data.profilePicture) {
          // Update profile picture path in userData
          setUserData((prevData) => ({
            ...prevData,
            profilePicture: uploadResponse.data.profilePicture,
          }));
        }
      }

      // Now update the profile details
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Try again!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          User Profile
        </h2>

        {userData.profilePicture && (
          <div className="flex justify-center mb-6">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${userData.profilePicture}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <input
                type="text"
                value={userData.gender}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                uploading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-semibold">Name: {userData.name}</p>
            <p className="text-lg font-semibold">Email: {userData.email}</p>
            <p className="text-lg font-semibold">Gender: {userData.gender}</p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
