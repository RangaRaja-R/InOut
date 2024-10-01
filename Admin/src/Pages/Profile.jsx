import React from 'react';
import '../Style/Profile.css'; // Import the CSS file

const Profile = () => {
    const userInfo = {
        id: 501,
        name: "Sathya",
        email: "admin@gmail.com",
        role: "Admin"
    };

    return (
        <div className='profile'>
            <div className='profile-head-left'>
                <h2 className='profile-title'>InOut</h2>
                <h3 className='profile-subtitle'>Profile</h3>
            </div>
            <div className='profile-container'>
                <h4 className='profile-about-title'>About</h4>
                <table className='profile-table'>
                    <tbody>
                        <tr>
                            <th className='profile-label'>ID</th>
                            <td className='profile-value'>{userInfo.id}</td>
                        </tr>
                        <tr>
                            <th className='profile-label'>Name</th>
                            <td className='profile-value'>{userInfo.name}</td>
                        </tr>
                        <tr>
                            <th className='profile-label'>Email Id</th>
                            <td className='profile-value'>{userInfo.email}</td>
                        </tr>
                        <tr>
                            <th className='profile-label'>Role</th>
                            <td className='profile-value'>{userInfo.role}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;
