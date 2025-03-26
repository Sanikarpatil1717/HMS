import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all"); // "name", "email", or "all"
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:8888/admin/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch users.");
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);
    setSearchValue(""); // Clear input when switching filters

    if (selectedFilter === "all") {
      fetchUsers(); // Reload all users when selecting "All Users"
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    let url = "";
    if (filterType === "name") {
      url = `http://localhost:8888/admin/users/name/${searchValue}`;
    } else if (filterType === "email") {
      url = `http://localhost:8888/admin/users/email/${searchValue}`;
    }

    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("No matching users found.");
        setLoading(false);
      });
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="container">
        <h1 className="page-title">Users List</h1>

        {/* Filter Dropdown */}
        <div className="filter-container">
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Users</option>
            <option value="name">Filter by Name</option>
            <option value="email">Filter by Email</option>
          </select>

          {/* Show Input Field Only for Name or Email */}
          {filterType !== "all" && (
            <>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Enter ${filterType}`}
                className="filter-input"
              />
              <button
                onClick={handleSearch}
                className="search-button"
              >
                Search
              </button>
            </>
          )}
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,index) => (
                <tr key={user.id}>
                  <td>{index+1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
