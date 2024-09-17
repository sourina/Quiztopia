import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../../components/LeafletMap.css";
import leaflet, { Map } from "leaflet";
import "./quizDetails.css";

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

function QuizDetails() {
  const { userId, quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [map, setMap] = useState<Map>();

  console.log(userId, quizId);

  // Fetch Quiz Details
  useEffect(() => {
    if (userId && quizId) {
      const fetchQuiz = async () => {
        try {
          const response = await fetch(
            `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log(data);
          setQuiz(data.quiz); // Store quiz data in state
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      };

      fetchQuiz();
    }
  }, [userId, quizId]);

  function getPosition() {
    if ("geolocation" in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    if (!position?.latitude) {
      getPosition();
    }
  }, [position]);

  useEffect(() => {
    if (position?.latitude && !map) {
      const myMap = leaflet
        .map("map")
        .setView([position.latitude, position.longitude], 10);
      setMap(myMap);
    }
  }, [position, map]);

  useEffect(() => {
    if (map && quiz) {
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      quiz.questions.forEach((question) => {
        console.log(question.location.latitude);
        const latitude = question.location.latitude;
        const longitude = question.location.longitude;

        const marker = leaflet
          .marker([parseFloat(latitude), parseFloat(longitude)])
          .addTo(map);

        marker.bindPopup(`${question.question}`);
      });
    }
  }, [map, quiz]);

  return (
    <div>
      <h1>Quiz: {quiz?.quizId}</h1>
      <h2>Created by: {quiz?.username}</h2>
      <div id="map" style={{ height: "400px" }}></div>
    </div>
  );
}

export default QuizDetails;
