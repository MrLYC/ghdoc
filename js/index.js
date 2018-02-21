import getRepo from "./github_api"
import Vue from "vue"

var vue = new Vue({
    el: "#main",
    data: {
        repoList: [],
    },
});

getRepo((repoList) => {
    vue.repoList = repoList;
});