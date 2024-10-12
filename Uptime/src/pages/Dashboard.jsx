import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correctly import jwt-decode as a named import
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgUrl, setNewOrgUrl] = useState("");
  const [usernames, setUsernames] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [orgStatus, setOrgStatus] = useState({});
  const [maintenanceStart, setMaintenanceStart] = useState({});
  const [maintenanceEnd, setMaintenanceEnd] = useState({});

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
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.username || ""; // Assuming 'username' is the key in the token payload
      } catch (error) {
        console.error("Failed to decode token:", error);
        return "";
      }
    }
    return "";
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "https://webalert-mern.onrender.com/api/organizations",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrganizations(response.data);
      // Fetch status after fetching organizations
      await checkOrgStatus(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const checkOrgStatus = async (orgs = organizations) => {
    try {
      const response = await axios.post(
        "https://webalert-mern.onrender.com/api/status/check-status",
        {
          organizations: orgs,
        }
      );
      console.log(response.data);
      setOrgStatus(response.data);
    } catch (error) {
      console.error("Error checking organization status:", error);
    }
  };

  const handleCreateOrganization = async () => {
    // Validate URL
    const urlPattern = /^https:\/\/.+$/;
    if (!urlPattern.test(newOrgUrl)) {
      toast.error('URL must start with "https://".');
      return;
    }

    try {
      const response = await axios.post(
        "https://webalert-mern.onrender.com/api/organizations/create",
        {
          name: newOrgName,
          url: newOrgUrl,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Organization created:", response.data);
      await fetchOrganizations(); // Refresh organizations list and statuses
      toast.success("Organization created successfully!");
    } catch (error) {
      console.error("Failed to create organization:", error);
      toast.error(
        error.response?.data?.message || "Failed to create organization"
      );
    }
  };

  const handleAddUser = async (orgId) => {
    const username = usernames[orgId] || "";
    try {
      const response = await axios.post(
        "https://webalert-mern.onrender.com/api/organizations/addUser",
        {
          username,
          orgId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("User added:", response.data);
      await fetchOrganizations(); // Refresh organizations list and statuses
      toast.success("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    try {
      const response = await axios.delete(
        `https://webalert-mern.onrender.com/api/organizations/${orgId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Organization deleted:", response.data);
      await fetchOrganizations(); // Refresh organizations list and statuses
      toast.success("Organization deleted successfully!");
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete organization"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isOwner = (org) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentUserId = decodedToken.id; // Assuming 'id' is the key in the token payload
      return org.owner === currentUserId;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return false;
    }
  };
  const handleSetMaintenance = async (orgId) => {
    try {
      const response = await axios.post(
        `https://webalert-mern.onrender.com/api/organizations/${orgId}/set-maintenance`,
        {
          start: maintenanceStart[orgId],
          end: maintenanceEnd[orgId]
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      console.log('Maintenance window added successfully:', response.data);
      await fetchOrganizations(); // Refresh organizations list and statuses
    } catch (error) {
      console.error('Failed to set maintenance period:', error);
      alert(error.response?.data?.message || 'Failed to set maintenance period');
    }
  };
  const getMaintenanceWindows = async (orgId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/organizations/${orgId}/get-maintenance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      console.log('Maintenance windows:', response.data);
      // Store or display maintenance windows based on your requirements
    } catch (error) {
      console.error('Failed to fetch maintenance windows:', error);
      alert(error.response?.data?.message || 'Failed to fetch maintenance windows');
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-[url(/background.jpg)]">
      <ToastContainer /> {/* Add ToastContainer here */}
      <Link to="/" className="relative lg:absolute w-full pt-4 md:pt-0 ">
        <img src="/logo.png" className="top-0 left-0 h-16" alt="logo" />
      </Link>
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Welcome,{" "}
          <span className="font-black bg-gradient-to-r from-blue-500 to-cyan-300 text-transparent bg-clip-text">
            {currentUser || "User"}
          </span>
          !
        </h1>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-500/20 border-2 border-red-400 text-white rounded-lg shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="w-full max-w-3xl bg-pink-500/10 border border-pink-500 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Create Organization
        </h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Organization Name"
            className="w-full p-2 border border-pink-700 bg-gray-800/30 text-white rounded-lg shadow-sm"
          />
          <input
            type="url"
            value={newOrgUrl}
            onChange={(e) => setNewOrgUrl(e.target.value)}
            placeholder="URL to Monitor"
            className="w-full p-2 border border-pink-700 bg-gray-800/30 text-white rounded-lg shadow-sm"
          />
          <button
            onClick={handleCreateOrganization}
            className="w-full py-2 bg-pink-900 border border-pink-300 text-white rounded-lg shadow-lg hover:bg-pink-950/80"
          >
            Create
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl bg-sky-500/10 border border-blue-500 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Your Organizations
        </h2>
        {Array.isArray(organizations) && organizations.length > 0 ? (
          organizations.map((org) => (
            <div
              key={org._id}
              className="p-4 mb-4 border border-blue-50 rounded-lg shadow-sm bg-black/30"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-pink-300">
                  {org.name}
                </h3>
                <span
                  className={classNames({
                    "text-green-500": orgStatus[org._id] === "live",
                    "text-red-500": orgStatus[org._id] === "down",
                    'text-yellow-500': orgStatus[org._id] === 'maintenance',
                  })}
                >
                  {orgStatus[org._id] === 'live' && '🟢 Live'}
                  {orgStatus[org._id] === 'down' && '🔴 Down'}
                  {orgStatus[org._id] === 'maintenance' && '🟡 Under Maintenance'}
                </span>
              </div>
              <p className="text-gray-400">
                URL: <span className="text-blue-300">{org.url}</span>
              </p>
              <p className="text-gray-400">
                Users: <span className="text-blue-300">{org.users.length}</span>
              </p>
              {isOwner(org) && (
                <div className="mt-4 flex flex-col space-y-2">
                  <input
                    type="text"
                    value={usernames[org._id] || ""}
                    onChange={(e) =>
                      setUsernames({ ...usernames, [org._id]: e.target.value })
                    }
                    placeholder="Username to Add"
                    className="p-2 border border-gray-700 bg-gray-800/50 text-white rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => handleAddUser(org._id)}
                    className="py-2 bg-blue-500/30 border border-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-500/50"
                  >
                    Add User
                  </button>
                  {/* Maintenance Start Time Input */}
                  <input
                    type="datetime-local"
                    value={maintenanceStart[org._id] || ''}
                    onChange={(e) =>
                      setMaintenanceStart({ ...maintenanceStart, [org._id]: e.target.value })
                    }
                    placeholder="Maintenance Start"
                    className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm"
                  />

                  {/* Maintenance End Time Input */}
                  <input
                    type="datetime-local"
                    value={maintenanceEnd[org._id] || ''}
                    onChange={(e) =>
                      setMaintenanceEnd({ ...maintenanceEnd, [org._id]: e.target.value })
                    }
                    placeholder="Maintenance End"
                    className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm"
                  />

                  {/* Set Maintenance Button */}
                  <button
                    onClick={() => handleSetMaintenance(org._id)}
                    className="py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600"
                  >
                    Set Maintenance
                  </button>

                  <button
                    onClick={() => handleDeleteOrganization(org._id)}
                    className="py-2 bg-sky-950/30 border-2 border-sky-950 text-white rounded-lg shadow-lg hover:bg-sky-800/50"
                  >
                    Delete Organization
                  </button>
                  <span className="text-red-600 font-semibold">currently there is a timezone mismatch while setting maintenance</span>
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
