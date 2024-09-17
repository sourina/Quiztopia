import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signUp.css";

type User = {
  username: string;
  password: string;
};

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    const userData: User = { username, password };

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup",
        {
          method: "POST", // använd post-metoden här!
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      console.log(data);
    } catch (error: any) {
      console.error(error);
    }
    navigate("/");
  }

  function handleGoBack(event: React.FormEvent) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div>
      <h3 className="signUp_heading"> Enter details to sign Up!! </h3>
      <form className="signUp_form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </label>
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleGoBack}>Go Back To Home</button>
      </form>
    </div>
  );
}

export default SignUp;
