import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSend = (e) => {
        e.preventDefault();
        // Optionally send email to backend
        navigate('/verify-otp');
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-primary text-white px-4">
                <div className=" hover:border-2 hover:border-[#eee] transition-all duration-100 w-full max-w-md bg-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                    <p className="text-sm mb-4 text-center">Enter your email to receive an OTP.</p>

                    <form onSubmit={handleSend}>
                        <div className='flex justify-start '>

                            <label className="block text-sm mb-1" htmlFor="email">Email</label>
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 mb-4 rounded-md bg-secondary text-white border border-gray-600"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-default py-2 rounded-md hover:bg-blue-700"
                        >
                            Send OTP
                        </button>
                    </form>

                    {/* Remembered password footer */}
                    <p className="text-xs sm:text-sm text-center text-[#FFFFFF] mt-6">
                        Remembered your password?{' '}
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#9293CC] underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
