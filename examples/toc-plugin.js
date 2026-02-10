/**
 * Table of Contents plugin example
 * Shows how to create a practical plugin for Confluence TOC macro
 */
const { ConfluencePageTransformer } = require('../src/index');

/**
 * Remark plugin that inserts Confluence TOC macro
 *
 * @param {Object} options - Plugin options
 * @param {number} [options.maxDepth=3] - Maximum heading depth
 * @param {string} [options.position='before-first-heading'] - Where to insert TOC
 * @returns {Function} Transformer function
 */
function remarkConfluenceToc(options = {}) {
  const { maxDepth = 3, position = 'before-first-heading' } = options;

  return function transformer(tree) {
    console.log(`Inserting Confluence TOC (maxDepth: ${maxDepth})`);

    // In a real implementation, this would:
    // 1. Find the correct position in the tree
    // 2. Insert a custom node representing the TOC macro
    // 3. The rehype plugin would convert it to proper ADF format

    // For this example, we just log
    console.log('TOC would be inserted at:', position);

    return tree;
  };
}

/**
 * Rehype plugin that converts TOC marker to Confluence ADF
 *
 * @param {Object} options - Plugin options
 * @returns {Function} Transformer function
 */
function rehypeConfluenceTocAdf(options = {}) {
  return function transformer(tree, file) {
    // In a real implementation, this would convert the TOC marker
    // to proper Confluence ADF format

    if (file.data.adf && file.data.adf.content) {
      // Example: Insert TOC macro at the beginning
      const _tocMacro = {
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'toc',
          parameters: {
            macroParams: {
              maxLevel: options.maxDepth || 3,
            },
          },
        },
      };

      // Insert at beginning (simplified)
      console.log('TOC macro would be inserted into ADF');
    }

    return tree;
  };
}

async function tocPluginExample() {
  console.log('=== TOC Plugin Example ===\n');

  const transformer = new ConfluencePageTransformer({
    remarkPluginsBefore: [[remarkConfluenceToc, { maxDepth: 3, position: 'before-first-heading' }]],
    rehypePluginsAfter: [[rehypeConfluenceTocAdf, { maxDepth: 3 }]],
  });

  const markdown = `
# Documentation

## Introduction

Welcome to the documentation.

## Getting Started

### Installation

Install the package...

### Configuration

Configure the settings...

## Advanced Topics

### Performance

Optimization tips...

### Security

Security best practices...
  `.trim();

  console.log('Markdown with headings:');
  console.log(markdown);
  console.log('\n---\n');

  const adf = await transformer.transform(markdown);

  console.log('ADF output with TOC:');
  console.log(JSON.stringify(adf, null, 2));
}

// Run example
if (require.main === module) {
  tocPluginExample().catch(console.error);
}

module.exports = { tocPluginExample, remarkConfluenceToc, rehypeConfluenceTocAdf };
