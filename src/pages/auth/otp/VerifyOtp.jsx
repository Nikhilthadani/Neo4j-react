import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = (e) => {
        e.preventDefault();
        // You would typically validate OTP here with backend
        // If successful, navigate to create new password
        navigate('/create-new-password');
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-primary text-white px-4">
                <div className=" hover:border-2 hover:border-[#eee] transition-all duration-100 w-full max-w-md bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
                    <p className="text-sm mb-4 text-center">Enter the OTP sent to your email.</p>
                    <form onSubmit={handleVerify}>
                        <div className='flex justify-start '>

                            <label className="block text-sm mb-1" htmlFor="otp">OTP</label>
                        </div>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            className="w-full px-4 py-2 mb-4 rounded-md bg-secondary text-white border border-gray-600"
                            required
                        />
                        <button type="submit" className="w-full bg-default py-2 rounded-md hover:bg-blue-700">
                            Verify
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default VerifyOtp;
