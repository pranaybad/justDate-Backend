import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Optional: Confirmation prompt before logout
        const isConfirmed = window.confirm("Are you sure you want to log out?");
        if (isConfirmed) {
            localStorage.removeItem('token');
            navigate("/");
        }
    };

    return (
        <div className="flex justify-center mt-6">
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default Logout;
