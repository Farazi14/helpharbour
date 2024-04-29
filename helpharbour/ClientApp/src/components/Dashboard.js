import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    // Use useEffect to handle redirection after the component has mounted
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/'); // Redirect to the login page if not logged in
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the Dashboard! You are logged in.</p>
        </div>
    );
};

export default Dashboard;
