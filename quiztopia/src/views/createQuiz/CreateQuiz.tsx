import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./createQuiz.css";

function CreateQuiz() {
  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string | null>("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = sessionStorage.getItem("token");
      setToken(savedToken);
    };
    checkToken();
  }, []);

  async function handleCreateQuiz(event: React.FormEvent) {
    event.preventDefault();

    if (token) {
      console.log(token);
      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (error: any) {
        console.error(error);
      }
    }
    navigate(`/addquestion/${name}`);
  }

  function handleGoBack(event: React.FormEvent) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div>
      <h3 className="createQuiz_heading"> Create Your Quiz Here!!</h3>
      <form className="createQuiz_form">
        <label>
          Quiz Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </label>
        <button onClick={handleCreateQuiz}>Create Quiz</button>
        <button onClick={handleGoBack}>Go Back To Home</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
