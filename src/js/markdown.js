import MarkdownIt from 'markdown-it';
import mkToc from 'markdown-it-github-toc';
import mkFootnote from 'markdown-it-footnote';
import mkTaskList from 'markdown-it-task-lists';
import hljs from 'highlightjs';

function highlightPlugin(render, opts) {
    render.options.highlight = (code, lang) => {
        if (hljs.getLanguage(lang)) {
            return hljs.highlight(code, lang);
        }
        return hljs.highlightAuto(code, lang);
    };

    var defaultFence = render.renderer.rules.fence;
    render.renderer.rules.fence = (...args) => {
        return render.apply(this, args)
            .replace('<code class="', '<code class="hljs ')
            .replace('<code>', '<code class="hljs">');
    };
}

function getRender() {
    var render = new MarkdownIt({
        html: true,
    });
    render.use(highlightPlugin);
    render.use(mkFootnote);
    render.use(mkTaskList);
    render.use(mkToc, {
        anchorClassName: "toc-anchor",
    });
    return render;
}

export function renderMarkdown(content) {
    var render = getRender();
    return render.render(content);
}