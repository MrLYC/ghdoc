import MarkdownIt from 'markdown-it';
import mkHighlight from 'markdown-it-highlightjs';
import mkToc from 'markdown-it-github-toc';
import mkFootnote from 'markdown-it-footnote';
import mkTaskList from 'markdown-it-task-lists';

function getRender() {
    var render = new MarkdownIt({
        html: true,
    });
    render.use(mkHighlight);
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