import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../../components/LeafletMap.css";
import leaflet, { Map } from "leaflet";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./addQuestion.css";

function AddQuestions() {
  const quizName = useParams();
  console.log(quizName);

  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [map, setMap] = useState<Map>();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [longitude, setLongitude] = useState<string>();
  const [latitude, setLatitude] = useState<string>();

  const [token, setToken] = useState<string | null>("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = sessionStorage.getItem("token");
      setToken(savedToken);
    };
    checkToken();
  }, []);

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
  }, []);

  useEffect(() => {
    if (position?.latitude && !map) {
      const myMap = leaflet
        .map("map")
        .setView([position?.latitude, position?.longitude], 15);

      setMap(myMap);
    }
  }, [position]);

  useEffect(() => {
    if (map && position) {
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      var circle = leaflet
        .circle([position?.latitude, position?.longitude], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 20,
        })
        .addTo(map);

      circle.bindTooltip("You are here!!");

      map.on("click", (event) => {
        console.log(event);
        const marker = leaflet
          .marker([event.latlng.lat, event.latlng.lng])
          .addTo(map);
        setLatitude(event.latlng.lat.toString());
        setLongitude(event.latlng.lng.toString());
      });
    }
  }, [map]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (token) {
      console.log(token);
      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: quizName.quizName,
              question,
              answer,
              location: { longitude, latitude },
            }),
          }
        );
        const data = await response.json();
        alert("saved");
        console.log(data);
      } catch (error: any) {
        console.error(error);
      }
    }
  }

  function goHome(event: React.FormEvent) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <>
      <h3 className="addQues_heading">Add your questions here!!</h3>
      <form className="addQues_form">
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          ></input>
        </label>
        <label>
          Answer:
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          ></input>
        </label>
        <button onClick={handleSave}>Save</button>
      </form>
      <section id="map"></section>
      <button className="home_btn" onClick={goHome}>
        Go To Home
      </button>
    </>
  );
}

export default AddQuestions;
