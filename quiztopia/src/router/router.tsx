import { createBrowserRouter } from "react-router-dom";
import Home from "../views/home/Home";
import SignUp from "../views/signup/SignUp";
import CreateQuiz from "../views/createQuiz/CreateQuiz";
import AddQuestions from "../views/addQuestion/AddQuestions";
import AllQuizes from "../views/allQuizes/AllQuizes";
import QuizDetails from "../views/quizDetails/QuizDetails";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/createquiz",
    element: <CreateQuiz />,
  },
  {
    path: "/addquestion/:quizName",
    element: <AddQuestions />,
  },
  {
    path: "/allQuizes",
    element: <AllQuizes />,
  },
  {
    path: "/quiz/:userId/:quizId",
    element: <QuizDetails />,
  },
]);

export default router;
