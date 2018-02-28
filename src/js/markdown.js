import marked from "marked"
import highlight from "highlight.js"

highlight.initHighlightingOnLoad();

function renderer() {
    var renderer = new marked.Renderer();
    return renderer;
}

marked.setOptions({
    gfm: true,
    breaks: true,
    renderer: renderer(),
    highlight: function (code, lang) {
        if (highlight.getLanguage(lang)) {
            return highlight.highlight(lang, code, true).value;
        }
        return highlight.highlightAuto(code).value;
    },
});

export default function renderMarkdown(content) {
    return marked(content);
}