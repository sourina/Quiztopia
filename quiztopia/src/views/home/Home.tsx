import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

type User = {
  username: string;
  password: string;
};

function Home() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  async function handleLogIn(event: React.FormEvent) {
    event.preventDefault();
    const userData: User = { username, password };
    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("something went wrong with POST :(((");
      }
      const data = await response.json();
      if (data.success) {
        console.log(data);
        sessionStorage.setItem("token", data.token);
        navigate("/createquiz");
      } else {
        alert("Something went wrong while logging in!!!");
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  function seeAllQuizes(event: React.FormEvent) {
    event.preventDefault();
    navigate("/allQuizes");
  }

  function signUp(event: React.FormEvent) {
    event.preventDefault();
    navigate("/signup");
  }

  return (
    <div>
      <h1 className="heading">Quiztopia</h1>
      <h3 className="subHeading">Log in to Create your customized Quiz</h3>
      <form className="loginForm">
        <label className="label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </label>
        <button onClick={handleLogIn}>Login</button>
        <h3> Not Signed up yet? </h3>
        <button onClick={signUp}> Sign Up</button>
        <h3> Want to Play?? Click to see all Quiz</h3>
        <button onClick={seeAllQuizes}> See All Quizes</button>
      </form>
    </div>
  );
}

export default Home;
