/**
 * Rehype plugin for Confluence ADF (Atlassian Document Format) conversion
 * This is a placeholder/mock for testing purposes
 */

/**
 * Rehype plugin to convert HTML to Confluence ADF format
 *
 * @param {Object} [options={}] - Plugin options
 * @returns {Function} Transformer function
 */
function rehypeConfluenceAdf(options = {}) {
    return function transformer(tree, file) {
        // Mock implementation - in a real version would convert the tree to ADF
        // Store ADF in file.data for retrieval
        file.data = file.data || {};
        file.data.adf = {
            version: 1,
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Mock ADF output',
                        },
                    ],
                },
            ],
        };

        return tree;
    };
}

module.exports = rehypeConfluenceAdf;