import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Home.css';

function Home() {
    const navi = useNavigate();

    return (
        <div className="home-container">
            <div className="button-container">
                <button onClick={() => { navi("/admin-sign-in") }} className="admin-login-button">Admin Login</button>
                <button onClick={() => { navi("/hr-sign-in") }} className="hr-login-button">HR Login</button>
            </div>
        </div>
    );
}

export default Home;
