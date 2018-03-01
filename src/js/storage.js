import lru from "lru-cache";

function SessionStorage() {
    this.set = function (key, value) {
        sessionStorage[key] = value;
    };
    this.get = function (key) {
        return sessionStorage[key];
    }
}

export default function Storage() {
    return sessionStorage ? new SessionStorage() : lru(100);
}