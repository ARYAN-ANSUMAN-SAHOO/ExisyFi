import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Home from './home';
import './home.css'; // Reuse global styles
import './auth.css'; // Auth specific styles

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        if (!userId) tempErrors.userId = "User ID is required";
        if (!password) tempErrors.password = "Password is required";
        return tempErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Safe industrial practice: Save JWT token tightly to local storage for subsequent authenticated requests
                    localStorage.setItem('token', data.token);
                    navigate('/dashboard');
                } else {
                    setLoginError(data.message || 'Login failed. Please verify your credentials.');
                }
            } catch (err) {
                console.error("Login fetch error:", err);
                setLoginError('Server is unreachable. Please try again later.');
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <>
            <div className="login-background">
                <Home />
            </div>
            <div className="page auth-container">
                <div className="glass-card auth-card">
                    <h2 style={{ marginBottom: '30px' }}>
                        Welcome to <span className="gradient-text" style={{ fontSize: '32px' }}>ExisyFi</span>
                    </h2>

                    {loginError && <div className="error-message">{loginError}</div>}

                    <form onSubmit={handleLogin} noValidate>
                        <FormInput
                            label="User ID"
                            name="userId"
                            type="text"
                            placeholder="Enter your user ID"
                            value={userId}
                            onChange={(e) => { setUserId(e.target.value); setErrors({ ...errors, userId: '' }); setLoginError(''); }}
                            error={errors.userId}
                        />

                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); setLoginError(''); }}
                            error={errors.password}
                        />

                        <button type="submit" className="primary-btn auth-button">
                            Log In
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?
                        <Link to="/register">Register here</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
