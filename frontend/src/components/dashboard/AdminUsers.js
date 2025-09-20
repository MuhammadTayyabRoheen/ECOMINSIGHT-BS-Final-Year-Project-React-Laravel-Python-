import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.data) {
        setUsers(res.data.data);
        setTotalPages(res.data.meta.last_page);
        setCurrentPage(res.data.meta.current_page);
      } else {
        console.error("Unexpected API format:", res.data);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh current page
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-users-container">
      <h2>All Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role === 'admin' ? (
                  <button className="delete-btn" disabled>Admin</button>
                ) : (
<button
  type="button"
  className="delete-btn"
  onClick={() => deleteUser(user.id)}
>
  Delete
</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
  {totalPages > 1 && (
  <div className="pagination-controls">
    <button
      className="pagination-btn"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      ← Previous
    </button>

    <span className="current-page">
      Page {currentPage} of {totalPages}
    </span>

    <button
      className="pagination-btn"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next →
    </button>
  </div>
)}

 
    </div>
  );
};

export default AdminUsers;
