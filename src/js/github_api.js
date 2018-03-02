import util from "util";
import path from "path";

export default function API(meta) {
    var self = this;
    self.meta = meta;

    self.getRepoFiles = function (callback, err_callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", meta.base, meta.user, meta.repo, meta.path);
        require(["./ajax"], function (ajax) {
            ajax.ajaxGet(url, (request) => {
                var data = JSON.parse(request.responseText);
                callback(data);
            }, (request) => {
                var data = JSON.parse(request.responseText);
                err_callback({
                    message: data.message || "Error",
                });
            });
        });
    }

    self.getFileContent = function (url, callback, err_callback) {
        require(["./ajax"], function (ajax) {
            ajax.ajaxGet(url, function (request) {
                callback(request.responseText);
            }, (request) => {
                err_callback({
                    message: request.responseText || "Error",
                });
            });
        });
    }
}