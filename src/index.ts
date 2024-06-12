import { API_KEY } from "./config";

const userForm = document.querySelector("form") as HTMLFormElement;
const userInput = document.querySelector("input") as HTMLInputElement;

const getCurrentPosition = function (): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Usage with async/await
const fetchLocation = async function () {
  try {
    const position = await getCurrentPosition();
    // console.log("Latitude:", position.coords.latitude);
    // console.log("Longitude:", position.coords.longitude);
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchLocation();
