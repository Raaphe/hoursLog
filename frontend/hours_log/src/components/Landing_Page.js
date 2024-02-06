import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const LandingPage = () => {
  const [users, setUsers] = useState([]);
  const [hover, setHover] = useState(false);

  const navigate = useNavigate();

  const cardStyle = {
    cursor: hover ? "pointer" : "default",
  };

  const getUsers = () => {
    axios.get("http://127.0.0.1:8000/employees/").then((res) => {
      const tempUsers = res.data;
      setUsers(tempUsers);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container-fluid">
      <div className="horizontal-scroll vh-100 d-flex justify-content-center align-items-center">
        {users.map((user) => (
          <div key={user.id} className="card-container">
            <div
              className="card"
              onClick={() =>
                navigate("/Dashboard", { state: { userId: user.id } })
              }
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={cardStyle}
            >
              <img
                className="card-img-top"
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='black' class='bi bi-person' viewBox='0 0 16 16'><path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z'/></svg>"
                alt="Card cap"
              />
              <div className="text-center">
                <h2>{user.firstName}</h2>
              </div>
            </div>
          </div>
        ))}
        <div className="card-container">
          <div
            className="card"
            onClick={() => navigate("/sign-up")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={cardStyle}
          >
            <img
              className="card-img-top"
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='black' class='bi bi-person' viewBox='0 0 16 16'><path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z'/></svg>"
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
