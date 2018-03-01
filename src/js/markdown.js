import MarkdownIt from 'markdown-it';
import mkHighlight from 'markdown-it-highlightjs';
import mkToc from 'markdown-it-github-toc';

export default function renderMarkdown(content) {
    var render = new MarkdownIt({
        html: true,
    });
    render.use(mkHighlight);
    render.use(mkToc, {
        anchorClassName: "toc-anchor",
    });
    return render.render(content);
}