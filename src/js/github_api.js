import util from "util"
import path from "path"
import ajaxGet from "./ajax"

export default function API(meta) {
    var self = this;
    self.meta = meta;

    self.getRepoFiles = function (callback) {
        var url = util.format("%s/repos/%s/%s/contents/%s", meta.base, meta.user, meta.repo, meta.path);
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