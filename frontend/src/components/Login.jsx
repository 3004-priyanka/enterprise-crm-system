import { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

console.log("TOKEN:", res.data.token);
console.log("ROLE:", res.data.role);
console.log("NAME:", res.data.name);

      alert("Login Successful");

      setIsLoggedIn(true);

    } catch (error) {

      alert(error.response.data.message);

    }

  };

  return (

    <div className="container mt-5" style={{ maxWidth: "450px" }}>

      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          CRM Login
        </h2>

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={loginUser}
        >
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;