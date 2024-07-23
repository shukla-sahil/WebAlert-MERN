import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwt-decode as a named import
import classNames from 'classnames';

const Dashboard = () => {
    const [organizations, setOrganizations] = useState([]);
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgUrl, setNewOrgUrl] = useState('');
    const [usernames, setUsernames] = useState({});
    const [currentUser, setCurrentUser] = useState('');
    const [orgStatus, setOrgStatus] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setCurrentUser(getCurrentUser());
            await fetchOrganizations();
        };
        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (organizations.length) {
                checkOrgStatus();
            }
        }, 2000); // Check status every 2 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [organizations]); // Re-run interval setup only when organizations change

    const getCurrentUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.username || ''; // Assuming 'username' is the key in the token payload
            } catch (error) {
                console.error('Failed to decode token:', error);
                return '';
            }
        }
        return '';
    };

    const fetchOrganizations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/organizations', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrganizations(response.data);
            // Fetch status after fetching organizations
            await checkOrgStatus(response.data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const checkOrgStatus = async (orgs = organizations) => {
        try {
            const response = await axios.post('http://localhost:5000/api/status/check-status', {
                organizations: orgs
            });
            setOrgStatus(response.data);
        } catch (error) {
            console.error('Error checking organization status:', error);
        }
    };

    const handleCreateOrganization = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/organizations/create', {
                name: newOrgName,
                url: newOrgUrl,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('Organization created:', response.data);
            await fetchOrganizations(); // Refresh organizations list and statuses
        } catch (error) {
            console.error('Failed to create organization:', error);
            alert(error.response?.data?.message || 'Failed to create organization');
        }
    };

    const handleAddUser = async (orgId) => {
        const username = usernames[orgId] || '';
        try {
            const response = await axios.post('http://localhost:5000/api/organizations/addUser', {
                username,
                orgId,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('User added:', response.data);
            await fetchOrganizations(); // Refresh organizations list and statuses
        } catch (error) {
            console.error('Failed to add user:', error);
            alert(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDeleteOrganization = async (orgId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/organizations/${orgId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('Organization deleted:', response.data);
            await fetchOrganizations(); // Refresh organizations list and statuses
        } catch (error) {
            console.error('Failed to delete organization:', error);
            alert(error.response?.data?.message || 'Failed to delete organization');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isOwner = (org) => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decodedToken = jwtDecode(token);
            const currentUserId = decodedToken.id; // Assuming 'id' is the key in the token payload
            return org.owner === currentUserId;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return false;
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-purple-900">
            <div className="w-full max-w-3xl flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Welcome, {currentUser || 'User'}!</h1>
                <button
                    onClick={handleLogout}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="w-full max-w-3xl bg-black rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Create Organization</h2>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        placeholder="Organization Name"
                        className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm"
                    />
                    <input
                        type="url"
                        value={newOrgUrl}
                        onChange={(e) => setNewOrgUrl(e.target.value)}
                        placeholder="URL to Monitor"
                        className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm"
                    />
                    <button
                        onClick={handleCreateOrganization}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            </div>

            <div className="w-full max-w-3xl bg-black rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Organizations</h2>
                {Array.isArray(organizations) && organizations.length > 0 ? (
                    organizations.map(org => (
                        <div key={org._id} className="p-4 mb-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-white">{org.name}</h3>
                                <span className={classNames({
                                    'text-green-500': orgStatus[org._id] === 'live',
                                    'text-red-500': orgStatus[org._id] === 'down',
                                })}>
                                    {orgStatus[org._id] === 'live' ? '🟢 Live' : '🔴 Down'}
                                </span>
                            </div>
                            <p className="text-gray-400">URL: {org.url}</p>
                            <p className="text-gray-400">Users: {org.users.length}</p>
                            {isOwner(org) && (
                                <div className="mt-4 flex flex-col space-y-2">
                                    <input
                                        type="text"
                                        value={usernames[org._id] || ''}
                                        onChange={(e) => setUsernames({ ...usernames, [org._id]: e.target.value })}
                                        placeholder="Username to Add"
                                        className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm"
                                    />
                                    <button
                                        onClick={() => handleAddUser(org._id)}
                                        className="py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
                                    >
                                        Add User
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOrganization(org._id)}
                                        className="py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                                    >
                                        Delete Organization
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-white">No organizations found</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
