"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const userForm = document.querySelector("form");
const userInput = document.querySelector("input");
const mainContent = document.querySelector("main");
let seconds = 10;
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
};
const clear = function () {
  mainContent.innerHTML = "";
};
const renderSpinner = function () {
  const markup = `<div class="loader mx-auto"></div>`;
  clear();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};
const renderData = function (data) {
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
const renderError = function (msg) {
  const markup = `<div class="error mx-auto p-6">
          <div>
            <img src="images/icon-alert-triangle.svg" alt="" />
          </div>
          <p>${msg}</p>
        </div>`;
  clear();
  mainContent.insertAdjacentHTML("afterbegin", markup);
};
const getLocation = function () {
  return __awaiter(this, arguments, void 0, function* (ip = "") {
    try {
      const res = yield Promise.race([
        fetch(`http://ipwho.is/${ip}`),
        timeout(seconds),
      ]);
      const data = yield res.json();
      console.log(data);
      if (!data.success) throw new Error("Could not retrieve data");
      return data;
    } catch (err) {
      throw err;
    }
  });
};
const loadData = function () {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      renderSpinner();
      const data = yield getLocation();
      renderData(data);
    } catch (err) {
      renderError(err.message);
    }
  });
};
const handleSubmit = function () {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const reg =
        /^(?:(?:\d{1,3}\.){3}\d{1,3}|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
      renderSpinner();
      if (userInput.value === "") throw new Error("Field is empty");
      if (!reg.test(userInput.value))
        throw new Error("Whoops, make sure it's an ip address");
      const data = yield getLocation(userInput.value);
      renderData(data);
      userInput.value = "";
    } catch (err) {
      renderError(err.message);
    }
  });
};
loadData();
userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});
