import { API_KEY } from "./config";

const userForm = document.querySelector("form") as HTMLFormElement;
const userInput = document.querySelector("input") as HTMLInputElement;
const mainContent = document.querySelector("main") as HTMLElement;

let second = 10;

// 105.119.0.160
const timeout = function (s: number) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
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
  readonly query: string;
  readonly isp: string;
  readonly city: string;
  readonly timezone: string;
  readonly region: string;
  readonly zip: string;
};

const renderData = function (data: any): void {
  const { query, isp, city, timezone, region, zip }: Data = data;
  const markup = `<div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">IP Address</p>
            <h2 class="data__value">${query}</h2>
          </div>
          <div class="line-horizontal"></div>
        </div>

        <div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">Location</p>
            <h2 class="data__value">${city}, ${region} ${zip}</h2>
          </div>
          <div class="line-horizontal"></div>
        </div>

        <div class="data">
          <div class="pl-10 max-tl:pl-6 max-bp:px-1">
            <p class="data__name">Timezone</p>
            <h2 class="data__value">UTC${timezone}</h2>
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
// const res = await Promise.race([fetchPro, timeout(seconds)]);

const getLocation = async function (): Promise<object> {
  try {
    // const res: any = await fetch(
    //   `https://geo.ipify.org/api/v2/country,city?apiKey=${"at_2FXcYc9PkYDG1F6AY5vVFyC9L5oHX"}&ipAddress=172.217.255.255`
    // );
    const res2: any = await fetch(`http://ip-api.com/json/`);

    // const data: object = await res.json();
    const data2: object = await res2.json();
    // console.log(data);
    console.log(data2);
    return data2;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// getLocation();

const loadData: any = async function () {
  try {
    renderSpinner();
    const data: object = await getLocation();
    renderData(data);
  } catch (error: any) {
    console.error("Error:", error);
    renderError(error.message);
  }
};

loadData();
