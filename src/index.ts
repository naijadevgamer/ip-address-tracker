import { API_KEY } from "./config";

const userForm = document.querySelector("form") as HTMLFormElement;
const userInput = document.querySelector("input") as HTMLInputElement;

const getCurrentPosition = function (): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const fetchLocation = async function () {
  try {
    const position = await getCurrentPosition();
    console.log(position);
    // console.log("Longitude:", position.coords.longitude);
  } catch (error) {
    console.error("Error:", error);
  }
};
// 105.119.0.160
const getLocation = async function () {
  try {
    const res: any = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${"at_2FXcYc9PkYDG1F6AY5vVFyC9L5oHX"}&ipAddress=172.217.255.255`
    );
    const res2: any = await fetch(`http://ip-api.com/json/`);

    const data: object = await res.json();
    const data2: object = await res2.json();
    console.log(data);
    console.log(data2);

    // console.log("Latitude:", position.coords.latitude);
    // console.log("Longitude:", position.coords.longitude);
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchLocation();
getLocation();
