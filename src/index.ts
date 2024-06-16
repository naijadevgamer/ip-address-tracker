/// <reference types="leaflet" />

// Declare the map variable, which will hold the Leaflet map instance
let map: L.Map | undefined;

// Select HTML elements and type cast them
const userForm = document.querySelector("form") as HTMLFormElement;
const userInput = document.querySelector("input") as HTMLInputElement;
const mainContent = document.querySelector("main") as HTMLElement;

// Set a timeout duration in seconds
let seconds: number = 10;

/**
 * Creates a promise that rejects after a specified number of seconds
 * @param s - Number of seconds before the promise rejects
 * @returns A promise that rejects with an error message
 */
const timeout = (s: number): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });

// Clears the inner HTML of the main content area
const clearContent = (): void => {
  mainContent.innerHTML = "";
};

// Renders a spinner to indicate loading
const renderSpinner = (): void => {
  const markup = `<div class="loader mx-auto"></div>`;
  clearContent();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

// Define a type for the data structure returned by the API
type Data = {
  readonly ip: string;
  readonly connection: { isp: string };
  readonly city: string;
  readonly timezone: { utc: string };
  readonly region_code: string;
  readonly postal: string;
};

/**
 * Renders the data returned from the API into the main content area
 * @param data - The data to be rendered
 */
const renderData = (data: Data): void => {
  const {
    ip,
    connection: { isp },
    city,
    timezone: { utc },
    region_code: regionCode,
    postal,
  } = data;

  const markup = `<div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">IP Address</p>
            <h2 class="data__value">${ip}</h2>
          </div>
          <div class="line-horizontal"></div>
        </div>

        <div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">Location</p>
            <h2 class="data__value">${city}, ${regionCode} ${postal}</h2>
          </div>
          <div class="line-horizontal"></div>
        </div>

        <div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">Timezone</p>
            <h2 class="data__value">UTC ${utc}</h2>
          </div>
          <div class="line-horizontal"></div>
        </div>

        <div
          class="w-1/4 px-10 font-medium max-tl:px-6 max-bp:mx-auto max-bp:w-full max-bp:px-1"
        >
          <p class="data__name">ISP</p>
          <h2 class="data__value">${isp}</h2>
        </div>`;
  clearContent();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

/**
 * Renders an error message into the main content area
 * @param msg - The error message to be displayed
 */
const renderError = (msg: string): void => {
  const markup = `<div class="error mx-auto p-6">
          <div>
            <img src="images/icon-alert-triangle.svg" alt="" />
          </div>
          <p>${msg}</p>
        </div>`;
  clearContent();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

/**
 * Initializes and loads the Leaflet map with a given position
 * @param position - Array containing latitude and longitude
 */
const loadMap = (position: [number, number]): void => {
  // Initialize the map
  if (map) {
    map.remove(); // Remove the existing map instance
  }
  const [lat, lng] = position;
  map = L.map("map").setView([lat, lng], 16);

  const myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [45, 55],
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([lat, lng], { icon: myIcon }).addTo(map);
};

/**
 * Fetches location data based on the provided IP address
 * @param ip - The IP address to fetch location data for (optional)
 * @returns The location data from the API
 * @throws Will throw an error if the data retrieval fails or times out
 */
const getLocation = async (ip: string = ""): Promise<any> => {
  try {
    const res = await Promise.race([
      fetch(`http://ipwho.is/${ip}`),
      timeout(seconds),
    ]);
    const data = await res.json();
    if (!data.success) throw new Error("Could not retrieve data");
    loadMap([data.latitude, data.longitude]);
    return data;
  } catch (err: any) {
    throw err;
  }
};

// Loads initial data when the page first loads
const loadData = async (): Promise<void> => {
  try {
    renderSpinner();
    const data = await getLocation();
    renderData(data);
  } catch (err: any) {
    renderError(err.message);
  }
};

// Handles the form submission, validates input, fetches location data, and updates the UI
const handleSubmit = async function (): Promise<void> {
  try {
    const reg =
      /^(?:(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
    renderSpinner();
    if (userInput.value === "") throw new Error("Field is empty");
    if (!reg.test(userInput.value))
      throw new Error("Whoops, make sure it's an IP address or domain");

    const data = await getLocation(userInput.value);
    renderData(data);
    userInput.value = "";
  } catch (err: any) {
    renderError(err.message);
  }
};

// Load data when the page first loads
loadData();

// Add an event listener to handle form submission
userForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  handleSubmit();
});
