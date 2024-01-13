import { useState, useEffect } from "react";
import userImage from "../Assets/Sample_User_Icon.png";
import axios from "axios";
import '../App.css';

const LandingPage = () => {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios.get("http://127.0.0.1:8000/employees/")
    .then((res) => {
      const tempUsers = res.data;
      setUsers(tempUsers);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <div className="horizontal-scroll vh-100 d-flex justify-content-center align-items-center">
        {users.map((user) => (
          <div key={user.id} className="card-container">
            <div className="card">
              <img
                className="card-img-top"
                src={userImage}
                alt="Card cap"
              />
              <div className="text-center">
                <h2>{user.firstName}</h2>
              </div>
            </div>
          </div>
        ))}
        <div className="card-container">
          <div className="card">
            <img
              className="card-img-top"
              src={userImage}
              alt="Card cap"
            />
            <div className="text-center">
              <h2>Add new user</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
