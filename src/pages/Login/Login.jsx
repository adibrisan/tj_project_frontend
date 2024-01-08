import React, { useContext, useState } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

import styles from "./Login.module.css";

const Login = () => {
  const { setCurrentUser } = useContext(UserContext);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (user && password) {
      axios
        .get(
          `http://localhost:8080/api/user-cars/login?user=${user}&password=${password}`
        )
        .then((res) => {
          toast.success("Successfully logged in !");
          setCurrentUser(res.data);
          localStorage.setItem("id", res.data.userId);
          if (res.data.levelAccess === 1) {
            navigate("/visitor");
          } else {
            navigate("/operator");
          }
        })
        .catch((_err) => toast.error("Incorrect credentials !"));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSection}>
        <h2>Login</h2>
        <Input
          placeholder="Username"
          size="large"
          onChange={(e) => setUser(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          size="large"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="primary" size="large" block onClick={handleLogin}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default Login;
