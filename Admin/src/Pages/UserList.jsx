import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/actions/UserListAction';
import '../Style/UserList.css';
import { useNavigate } from 'react-router-dom';

function UserList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user);
  const userlist = useSelector(state => state.users);

  useEffect(() => {
    if (selector.user) {
      dispatch(getAllUsers());
    }
  }, [dispatch, selector.user]);

  const handleOffSite = (email) => {
    navigate("/offsite", { state: { email } });
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const stampConverter = (check) => {
    if(check===null){
      return "-"
    }
    const formattedDateTime = new Date(check).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
    return formattedDateTime;
  };

  return (
    <div className="user-list-container">
      <h2>Employee List</h2>
      <button className="add-user-button" onClick={()=>{dispatch(getAllUsers())}}>Refresh</button>
      <button className="add-user-button" onClick={handleAddUser}>Add User</button>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Last Check-In</th>
            <th>Last Check-Out</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userlist.users && userlist.users.length > 0 ? (
            userlist.users.map((u, index) => (
              <tr key={index} className="table-row">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{stampConverter(u.check_in)}</td>
                <td>{stampConverter(u.check_out)}</td>
                <td>
                  <button className="offsite-button" onClick={() => handleOffSite(u.email)}>Off Site</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
