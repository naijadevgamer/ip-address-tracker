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
            <h2 class="data__value">UTC${utc}</h2>
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
    const res: any = await fetch(`http://ipwho.is/`);
    const data: object = await res.json();
    console.log(data);
    return data;
  } catch (err: any) {
    throw err;
  }
};
// getLocation();

const loadData: any = async function (): Promise<void> {
  try {
    renderSpinner();
    const data: object = await getLocation();
    renderData(data);
  } catch (err: any) {
    renderError(err.message);
  }
};

loadData();
