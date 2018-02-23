import util from "util"
import path from "path"
import ajaxGet from "./ajax"

export default function API(config) {
    var self = this;
    self.config = config;

    self.getRepoFiles = function (callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", config.base, config.user, config.repo, config.path);
        ajaxGet(url, function (request) {
            var data = JSON.parse(request.responseText);
            callback(data); 
        });
    }

    self.getFileContent = function (url, callback) {
        ajaxGet(url, function (request) {
            callback(request.responseText);
        });
    }
}