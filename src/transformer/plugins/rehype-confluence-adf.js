/**
 * Rehype plugin for Confluence ADF (Atlassian Document Format) conversion
 * Converts HTML AST to Confluence ADF format
 */

/**
 * Convert rehype node to ADF node
 * This is a simplified implementation for demonstration
 *
 * @param {Object} node - Rehype node
 * @returns {Array|Object|null} ADF content
 */
function convertNode(node) {
  if (!node) return [];

  // Handle root node
  if (node.type === 'root') {
    const content = [];
    if (node.children) {
      node.children.forEach((child) => {
        const converted = convertNode(child);
        if (Array.isArray(converted)) {
          content.push(...converted);
        } else if (converted) {
          content.push(converted);
        }
      });
    }
    return content;
  }

  // Handle element nodes
  if (node.type === 'element') {
    const { tagName } = node;

    switch (tagName) {
      case 'p':
        return {
          type: 'paragraph',
          content: convertChildren(node),
        };

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return {
          type: 'heading',
          attrs: {
            level: parseInt(tagName[1], 10),
          },
          content: convertChildren(node),
        };

      case 'ul':
        return {
          type: 'bulletList',
          content: convertChildren(node).map((item) => ({
            type: 'listItem',
            content: Array.isArray(item) ? item : [item],
          })),
        };

      case 'ol':
        return {
          type: 'orderedList',
          content: convertChildren(node).map((item) => ({
            type: 'listItem',
            content: Array.isArray(item) ? item : [item],
          })),
        };

      case 'li':
        return {
          type: 'paragraph',
          content: convertChildren(node),
        };

      case 'strong':
      case 'b':
        return {
          type: 'text',
          text: extractText(node),
          marks: [{ type: 'strong' }],
        };

      case 'em':
      case 'i':
        return {
          type: 'text',
          text: extractText(node),
          marks: [{ type: 'em' }],
        };

      case 'code':
        return {
          type: 'text',
          text: extractText(node),
          marks: [{ type: 'code' }],
        };

      case 'pre': {
        // Code block
        const codeContent = extractText(node);
        return {
          type: 'codeBlock',
          attrs: {
            language: 'javascript', // Could be extracted from classes
          },
          content: [
            {
              type: 'text',
              text: codeContent,
            },
          ],
        };
      }

      case 'a':
        return {
          type: 'text',
          text: extractText(node),
          marks: [
            {
              type: 'link',
              attrs: {
                href: node.properties?.href || '#',
              },
            },
          ],
        };

      default:
        // For unknown elements, try to convert children
        return convertChildren(node);
    }
  }

  // Handle text nodes
  if (node.type === 'text') {
    return {
      type: 'text',
      text: node.value || '',
    };
  }

  return null;
}

/**
 * Convert children nodes
 *
 * @param {Object} node - Parent node
 * @returns {Array} Converted children
 */
function convertChildren(node) {
  if (!node.children || node.children.length === 0) {
    return [];
  }

  const content = [];
  node.children.forEach((child) => {
    const converted = convertNode(child);
    if (Array.isArray(converted)) {
      content.push(...converted);
    } else if (converted) {
      content.push(converted);
    }
  });

  return content;
}

/**
 * Extract plain text from node and its children
 *
 * @param {Object} node - Node to extract text from
 * @returns {string} Extracted text
 */
function extractText(node) {
  if (node.type === 'text') {
    return node.value || '';
  }

  if (node.children) {
    return node.children.map(extractText).join('');
  }

  return '';
}

/**
 * Rehype plugin to convert HTML to Confluence ADF format
 * This is the compiler plugin that generates the final ADF output
 *
 * @param {Object} [_options={}] - Plugin options (unused in current implementation)
 * @returns {Function} Transformer function
 */
function rehypeConfluenceAdf(_options = {}) {
  // This is a unified compiler plugin
  // It must attach a Compiler to this.Compiler

  this.Compiler = function compiler(tree) {
    // Convert rehype tree to Confluence ADF
    const adf = {
      version: 1,
      type: 'doc',
      content: convertNode(tree),
    };

    return adf;
  };

  return function transformer(tree, file) {
    // Store ADF in file.data for retrieval
    file.data = file.data || {};

    // The actual conversion happens in the Compiler
    // We just ensure the structure is ready
    return tree;
  };
}

module.exports = rehypeConfluenceAdf;
