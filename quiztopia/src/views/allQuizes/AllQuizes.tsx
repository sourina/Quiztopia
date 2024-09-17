import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./allQuizes.css";

type Quiz = {
  questions: [
    {
      question: string;
      answer: string;
      location: { latitude: string; longitude: string };
    }
  ];
  quizId: string;
  userId: string;
  username: string;
};

function AllQuizes() {
  const [quizList, setQuizList] = useState<Quiz[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setQuizList(data.quizzes);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, []);

  console.log(quizList);

  function goToQuizDetails(quiz: Quiz) {
    navigate(`/quiz/${quiz.userId}/${quiz.quizId}`);
  }

  return (
    <div className="all_Quiz">
      <h3> All Quizes</h3>
      {quizList.map((quiz) => (
        <div onClick={() => goToQuizDetails(quiz)}>
          <h1>{quiz.username}</h1>
          <br></br>
          <h1>{quiz.quizId}</h1>
          
        </div>
      ))}
    </div>
  );
}

export default AllQuizes;
