(function(){
    var gh_api = null;
    var toc_tpl = null;
    var md_converter = null;
    
    var $toc_list = null;
    var $article_area = null;
    var $title = null;

    function render_toc(toc){
        $toc_list.html(toc_tpl({
            toclist: toc
        }));
    }
    
    function render_markdown(text) {
        $article_area.html(md_converter.makeHtml(text));
    }
    
    function list_dir(dir_name, callback) {
        if(typeof dir_name == "undefined"){
            dir_name = META.directory;
        }
        var url = gh_api + "/" + dir_name;
        $.getJSON(
            url, function(data){
                var toc_list = [];
                for(var i in data){
                    var item = data[i];
                    toc_list.push({
                        name: item["name"],
                        url: item["download_url"],
                    });
                }
                callback(toc_list);
            }
        );
    }
    
    function fetch_doc(item){
        $.get(item.url, render_markdown);
        $title.text(item.name);
    }
    
    $(function init(){
        gh_api = [META.api, "repos", META.user, META.repo, "contents"].join("/");
        toc_tpl = Handlebars.compile($("#toc-tpl").html());
        md_converter = new showdown.Converter();
    
        $toc_list = $("#toc-list");
        $article_area = $("#article");
        $title = $("title");
    
        render_markdown($("#md-default").text());
        list_dir(META.directory, render_toc);
    });
})();