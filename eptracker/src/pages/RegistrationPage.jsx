import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import './registration.css';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const validate = (values) => {
        let tempErrors = {};
        const nameRegex = /^[a-zA-Z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!values.firstName) {
            tempErrors.firstName = "First Name is required";
        } else if (!nameRegex.test(values.firstName)) {
            tempErrors.firstName = "Only alphabets allowed";
        }

        if (!values.lastName) {
            tempErrors.lastName = "Last Name is required";
        } else if (!nameRegex.test(values.lastName)) {
            tempErrors.lastName = "Only alphabets allowed";
        }

        if (!values.email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(values.email)) {
            tempErrors.email = "Invalid email format";
        }

        if (!values.password) {
            tempErrors.password = "Password is required";
        } else if (!passwordRegex.test(values.password)) {
            tempErrors.password = "Min 8 chars, 1 letter, 1 number";
        }

        return tempErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                
                if (response.ok) {
                    console.log("Registered successfully:", data);
                    navigate('/login');
                } else {
                    setErrors({ form: data.message || "Registration failed" });
                }
            } catch (err) {
                console.error("Registration error:", err);
                setErrors({ form: "Server is unreachable. Please try again later." });
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="register-container">
            {/* LEFT SIDE */}
            <div className="register-left">
                <div className="register-left-content">
                    <div className="brand-logo">
                        <div className="brand-icon"></div>
                        <span>ExisyFi</span>
                    </div>

                    <h1>Get Started with Us</h1>
                    <p>Complete these easy steps to register your account.</p>

                    <div className="steps-container">
                        <div className="step-item active">
                            <div className="step-number">1</div>
                            <span>Sign up your account</span>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <span>Set up your workspace</span>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <span>Set up your profile</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="register-right">
                <div className="register-header">
                    <h2>Sign Up Account</h2>
                    <p>Enter your personal data to create your account.</p>
                </div>

                <div className="social-buttons">
                    <button className="social-btn">
                        <span>G</span> Google
                    </button>
                    <button className="social-btn">
                        <span>●</span> Github
                    </button>
                </div>

                <div className="divider">
                    <span>Or</span>
                </div>

                <form onSubmit={handleRegister} noValidate>
                    {errors.form && <div className="form-error" style={{color: 'red', marginBottom: '10px'}}>{errors.form}</div>}
                    <div className="form-row">
                        <FormInput
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="eg. John"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                        />
                        <FormInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="eg. Francisco"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                        />
                    </div>

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="eg. johnfrans@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <div className="password-hint">Must be at least 8 characters.</div>

                    <button type="submit" className="submit-btn">Sign Up</button>
                </form>

                <div className="login-link">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
