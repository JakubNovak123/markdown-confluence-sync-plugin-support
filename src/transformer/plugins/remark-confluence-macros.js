/**
 * Remark plugin for Confluence macros
 * This is a placeholder/mock for testing purposes
 */

/**
 * Remark plugin to handle Confluence-specific macros
 *
 * @param {Object} [options={}] - Plugin options
 * @returns {Function} Transformer function
 */
function remarkConfluenceMacros(options = {}) {
    return function transformer(tree) {
        // Mock implementation - in a real version would transform a tree
        // to add Confluence macro support
        return tree;
    };
}

module.exports = remarkConfluenceMacros;