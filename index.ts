import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Html, Root } from 'mdast';

const rehypeHighlight: Plugin<[], Root> = () => {
    return tree => {
        visit(tree, 'text', (node, index, parent) => {
            if (node.type !== 'text') return;

            const regex = /==([^=]+)==/g;
            const highlightMatch = node.value.match(regex);

            // remove the "=="
            if (!highlightMatch) return;

            if (highlightMatch && parent && index !== undefined) {
                // example : "is a ==with text== ." will become : "is a <span class='highlight'>with text</span> ."

                const newNode: Html = {
                    type: 'html',
                    value: node.value.replace(regex, (_match, p1) => `<span class="highlight">${p1}</span>`),
                };

                parent.children[index] = newNode;
            }
        });
    };
};

export default rehypeHighlight;
