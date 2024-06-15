/// <reference types="leaflet" />
// declare var L: any;

const userForm = document.querySelector("form") as HTMLFormElement;
const userInput = document.querySelector("input") as HTMLInputElement;
const mainContent = document.querySelector("main") as HTMLElement;

let seconds: number = 10;

const timeout = function (s: number): Promise<object> {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};

const clear = function (): void {
  mainContent.innerHTML = "";
};

const renderSpinner = function (): void {
  const markup = `<div class="loader mx-auto"></div>`;
  clear();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

type Data = {
  readonly ip: string;
  readonly connection: { isp: string };
  readonly city: string;
  readonly timezone: { utc: string };
  readonly region_code: string;
  readonly postal: string;
};

const renderData = function (data: any): void {
  const {
    ip,
    connection: { isp },
    city,
    timezone: { utc },
    region_code: regionCode,
    postal,
  }: Data = data;
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
  clear();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

const renderError = function (msg: string): void {
  const markup = `<div class="error mx-auto p-6">
          <div>
            <img src="images/icon-alert-triangle.svg" alt="" />
          </div>
          <p>${msg}</p>
        </div>`;
  clear();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};

const getLocation = async function (ip: string = ""): Promise<object> {
  try {
    const res: any = await Promise.race([
      fetch(`http://ipwho.is/${ip}`),
      timeout(seconds),
    ]);
    const data: any = await res.json();
    console.log(data);
    if (!data.success) throw new Error("Could not retrieve data");
    return data;
  } catch (err: any) {
    throw err;
  }
};

const loadData: any = async function (): Promise<void> {
  try {
    renderSpinner();
    const data: object = await getLocation();
    renderData(data);
  } catch (err: any) {
    renderError(err.message);
  }
};

const handleSubmit = async function (): Promise<void> {
  try {
    const reg: RegExp =
      /^(?:(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
    renderSpinner();
    if (userInput.value === "") throw new Error("Field is empty");
    if (!reg.test(userInput.value))
      throw new Error("Whoops, make sure it's an ip address");
    const data: object = await getLocation(userInput.value);
    renderData(data);
    userInput.value = "";
  } catch (err: any) {
    renderError(err.message);
  }
};
loadData();
userForm.addEventListener("submit", (e: any) => {
  e.preventDefault();
  handleSubmit();
});

// Initialize the map
const map: any = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var myIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [45, 60],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  // shadowUrl: "my-icon-shadow.png",
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94],
});

const marker: any = L.marker([51.5, -0.09], { icon: myIcon }).addTo(map);
