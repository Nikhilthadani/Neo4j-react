import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Call backend to update password
        alert("Password has been reset successfully!");
        navigate('/'); // Redirect to login page
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-primary text-white px-4">
                <div className=" hover:border-2 hover:border-[#eee] transition-all duration-100 w-full max-w-md bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Create New Password</h2>
                    <p className="text-sm mb-4 text-center">Set a new password for your account.</p>
                    <form onSubmit={handleReset}>
                        <div className='flex justify-start '>

                            <label className="block text-sm mb-1" htmlFor="password">New Password</label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full px-4 py-2 mb-4 rounded-md bg-secondary text-white border border-gray-600"
                            required
                        />

                        <div className='flex justify-start '>

                            <label className="block text-sm mb-1" htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 mb-4 rounded-md bg-secondary text-white border border-gray-600"
                            required
                        />

                        <button type="submit" className="w-full bg-default py-2 rounded-md hover:bg-blue-700">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateNewPassword;
