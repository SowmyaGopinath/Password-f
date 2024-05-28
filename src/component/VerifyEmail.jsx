import React, { useState } from "react";
import { webClient } from "../util/config";
import { Input } from "./Input";
import { useDispatch } from 'react-redux';
import { login } from "../redux/slice/userSlice";
import { useNavigate } from 'react-router-dom';
import { API } from "../util/constants";
import { useEffect } from "react";
import axios from 'axios';

function VerifyEmail() {

    const [emailOTP, setEmailOTP] = useState(null);

    useEffect(() => {
        // Function to fetch the OTP when the component mounts
        getEmailOTP();
    }, []); // Empty dependency array ensures the effect runs only once after the initial render

    const getEmailOTP = () => {
        webClient.get('http://192.168.1.20:5000/user/generatedOTP') // Assuming your backend route for getting OTP is '/user/generatedOTP'
            .then(response => {
                // Handle successful response
                setEmailOTP(response.data.otp); // Assuming the OTP is returned in the response data
                console.log('OTP in console',response.data.otp);
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching OTP:', error);
            });
    };

    useEffect(() => {
        const form = document.getElementById('otp-form');
        const inputs = [...form.querySelectorAll('input[type=text]')];
        const submit = form.querySelector('button[type=submit]');

        const handleKeyDown = (e) => {
            if (
                !/^[0-9]{1}$/.test(e.key)
                && e.key !== 'Backspace'
                && e.key !== 'Delete'
                && e.key !== 'Tab'
                && !e.metaKey
            ) {
                e.preventDefault();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const index = inputs.indexOf(e.target);
                if (index > 0) {
                    inputs[index - 1].value = '';
                    inputs[index - 1].focus();
                }
            }
        };

        const handleInput = (e) => {
            const { target } = e;
            const index = inputs.indexOf(target);
            if (target.value) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    submit.focus();
                }
            }
        };

        const handleFocus = (e) => {
            e.target.select();
        };

        const handlePaste = (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) {
                return;
            }
            const digits = text.split('');
            inputs.forEach((input, index) => input.value = digits[index]);
            submit.focus();
        };

        inputs.forEach((input) => {
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeyDown);
            input.addEventListener('focus', handleFocus);
            input.addEventListener('paste', handlePaste);

            return () => {
                // Clean up event listeners when the component unmounts
                input.removeEventListener('input', handleInput);
                input.removeEventListener('keydown', handleKeyDown);
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('paste', handlePaste);
            };
        });
    }, []); // Run this effect only once on component mount

    return (
        <>
            <div className="app-container">
                <div className="relative font-inter antialiased">
                    <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
                        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                            <div className="flex justify-center">
                                <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                                    <header className="mb-8">
                                        <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                                        <p className="text-[15px] text-slate-500">Enter the 4-digit verification code that was sent to your email.</p>
                                    </header>
                                    <form id="otp-form">
                                        <div className="flex items-center justify-center gap-3">
                                            <input
                                                type="text"
                                                 />
                                            
                                        </div>
                                        <div className="max-w-[260px] mx-auto mt-4">
                                            <button type="submit" style={{ backgroundColor: 'blue', color: 'white' }}
                                                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">Verify
                                                Email</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;
