import React, { useState } from 'react';
import { SignUpInput } from './Input'; // Ensure this import path is correct
import { Link } from 'react-router-dom';
import { webClient } from '../util/config';

function SignUpForm() {
    const emptyUser = {
        username: "",
        password: "",
        confirmPassword: "",
        email: ""  // Add email to the emptyUser object
    };
    const [user, setUser] = useState(emptyUser);

    function handleOnChange(event) {
        const { id, value } = event.target; 
        setUser(prevUser => ({
            ...prevUser,
            [id]: value
        }));
    }

    function saveUserDetails() {
        webClient.post('https://passwordmanager-backend-y8fh.onrender.com/user/addUserDetails', user)
            .then(response => {
                setUser(emptyUser);
                alert('Success');
                OTPEmail(user.email);  // Pass the email to OTPEmail
                window.location.href='/VerifyEmail'
            })
            .catch(err => {
                console.error("Error saving user details:", err);
                alert("Error occurred while saving user details. Please try again.");
            });
    }

    function OTPEmail(email) {
        webClient.post('http://192.168.1.20:5000/user/sendOTP', { email: email })
        .then(response => {
            console.log('OTP Email response:', response);
        })
        .catch(err => {
            console.error("Error OTP Email:", err);
            alert("Email error");
        });
    }

    function checkIfUserExists() {
        webClient.post('https://passwordmanager-backend-y8fh.onrender.com/user/checkIfUserExists', { username: user.username })
            .then(response => {
                console.log("Response:", response);
                if (response.status === 200) {
                    alert("Username already exists! Try with a different username.");
                } else {
                    saveUserDetails();
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 404) {
                        saveUserDetails();
                    } else if (error.response.status === 500) {
                        alert("Internal Server error. Please try again.");
                    } else {
                        console.error("Unexpected error response:", error.response);
                        alert("An unexpected error occurred. Please try again.");
                    }
                } else {
                    console.error("Request error:", error);
                    alert("An unexpected error occurred. Please try again.");
                }
            });
    }

    function submitSignUp(event) {
        event.preventDefault();
        if (user.password !== user.confirmPassword) {
            alert("Password and Confirm Password should match. Please recheck and submit.");
        } else {
            checkIfUserExists();
        }
    }

    return (
        <form onSubmit={submitSignUp}>
            <h1 className="h3 mt-5 mb-3 fw-normal sign-up-title">Sign up</h1>
            <SignUpInput type="text" id="username" value={user.username} placeholder="Username" onChange={handleOnChange} />
            <SignUpInput type="password" id="password" value={user.password} placeholder="Password" onChange={handleOnChange} />
            <SignUpInput type="password" id="confirmPassword" value={user.confirmPassword} placeholder="Confirm Password" onChange={handleOnChange} />
            <SignUpInput type="email" id="email" value={user.email} placeholder="Email" onChange={handleOnChange} /> {/* Update email field */}
            <button className="btn btn-primary mt-3 w-100 py-10" type="submit">Sign up</button>
            <h2 className="h6 mt-3 fw-normal">Already have an account? <span><Link className="login-link" to="/LoginPage">Login</Link></span></h2>
        </form>
    );
}

export default SignUpForm;
