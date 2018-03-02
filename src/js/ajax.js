export function ajaxGet(url, success, error) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            success(request);
        } else {
            error(request);
        }
    };

    request.onerror = function () {
        throw "ajax error";
    };

    request.send();
}