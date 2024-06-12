var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userForm = document.querySelector("form");
const userInput = document.querySelector("input");
const getCurrentPosition = function () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};
const fetchLocation = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const position = yield getCurrentPosition();
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
};
fetchLocation();
export {};
