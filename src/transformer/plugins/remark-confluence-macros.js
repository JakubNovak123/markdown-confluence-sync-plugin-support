/**
 * Remark plugin to handle Confluence-specific macros
 *
 * @param {Object} [_options={}] - Plugin options (unused in mock)
 * @returns {Function} Transformer function
 */
function remarkConfluenceMacros(_options = {}) {
  return function transformer(tree) {
    // Mock implementation - in a real version would transform a tree
    // to add Confluence macro support
    return tree;
  };
}

module.exports = remarkConfluenceMacros;
