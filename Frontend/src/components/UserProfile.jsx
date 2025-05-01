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
          setUserData((prevData) => ({
            ...prevData,
            profilePicture: uploadResponse.data.profilePicture,
          }));
        }
      }

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
    <div className="  min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}


      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-lg w-full p-10 relative overflow-hidden transform transition-all duration-700 hover:scale-105 border border-white border-opacity-20">
        {/* Gradient Header Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>

        {/* Profile Header */}
        <h2 className="text-4xl font-extrabold text-center text-black mt-6 mb-8 tracking-wide animate-fade-in drop-shadow-lg">
          {userData.name ? `Hello, ${userData.name}!` : "Your Profile"}
        </h2>

        {/* Profile Picture with Animated Glow */}
        <div className="flex justify-center mb-10 relative">
          <div className="relative group">
            {userData.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/Uploads/${userData.profilePicture}`}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white border-opacity-30 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:shadow-glow"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 flex items-center justify-center text-black text-3xl font-bold shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:shadow-glow">
                {userData.name.charAt(0) || "U"}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="relative group">
              <label className="block text-sm font-medium text-black mb-2">Name</label>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:shadow-glow"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-black mb-2">Email</label>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:shadow-glow"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-black mb-2">Gender</label>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <input
                  type="text"
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  className="w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-black placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:shadow-glow"
                  placeholder="Enter your gender"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-black mb-2">Change Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-black file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-black hover:file:bg-indigo-600 transition-colors duration-300 group-hover:shadow-glow"
              />
            </div>

            {uploading && (
              <div className="relative w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress"></div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="relative w-full py-3 px-4 bg-white bg-opacity-20 text-black rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 group"
                title="Cancel changes"
              >
                Cancel
                <span className="absolute hidden group-hover:block text-xs text-black -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded">Discard changes</span>
              </button>
              <button
                type="submit"
                disabled={uploading}
                className={`relative w-full py-3 px-4 rounded-xl text-black font-semibold flex items-center justify-center transition-all duration-300 group ${
                  uploading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                title="Save changes"
              >
                {uploading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : null}
                {uploading ? "Saving..." : "Save Changes"}
                <span className="absolute hidden group-hover:block text-xs text-black -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 px-2 py-1 rounded">
                  {uploading ? "Processing..." : "Save profile"}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-4 rounded-xl transition-all duration-300 hover:bg-opacity-30 group">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <span className="text-sm text-gray-300">Name</span>
                <p className="text-lg font-semibold text-black">{userData.name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-4 rounded-xl transition-all duration-300 hover:bg-opacity-30 group">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <div>
                <span className="text-sm text-gray-300">Email</span>
                <p className="text-lg font-semibold text-black">{userData.email || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white bg-opacity-20 p-4 rounded-xl transition-all duration-300 hover:bg-opacity-30 group">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <div>
                <span className="text-sm text-gray-300">Gender</span>
                <p className="text-lg font-semibold text-black">{userData.gender || "Not set"}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="relative w-full py-3 px-4 bg-indigo-600 text-black rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
              title="Edit profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
              <span className="absolute hidden group-hover:block text-xs text-black -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 px-2 py-1 rounded">Update your info</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
          background-size: 200% 200%;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        .shadow-glow {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UserProfile;