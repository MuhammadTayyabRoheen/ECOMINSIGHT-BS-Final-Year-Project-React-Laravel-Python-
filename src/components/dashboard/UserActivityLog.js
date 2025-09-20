import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserActivityLog = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/admin/users?recent=1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    fetchRecentUsers();
  }, []);

  return (
    <div className="card p-3 mb-4">
      <h5>Recent Signups</h5>
      <ul className="list-group list-group-flush">
        {users.map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between">
            <span>{user.name}</span>
            <span className="text-muted small">{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivityLog;
