/**
 * Example configuration file
 * Place this in your project root as markdown-confluence-sync.config.js
 */

/**
 * Custom plugin that adds table of contents marker
 */
function remarkTocMarker(_options = {}) {
  return function transformer(tree) {
    console.log('TOC marker plugin executed');
    // In real implementation, this would add TOC macro
    return tree;
  };
}

/**
 * Custom plugin that tracks headings
 */
function remarkHeadingTracker(_options = {}) {
  return function transformer(tree, file) {
    file.data.headingCount = 0;

    // Count headings (simplified example)
    const visit = (node) => {
      if (node.type === 'heading') {
        file.data.headingCount += 1;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
    console.log(`Found ${file.data.headingCount} headings`);
    return tree;
  };
}

module.exports = {
  // Confluence connection settings (if needed by main library)
  confluenceBaseUrl: 'https://confluence.example.com',
  spaceKey: 'DOCS',

  // Plugin configuration
  remarkPluginsBefore: [[remarkHeadingTracker, { enabled: true }]],

  remarkPluginsAfter: [[remarkTocMarker, { maxDepth: 3 }]],

  rehypePluginsBefore: [
    // Add custom rehype plugins here
  ],

  rehypePluginsAfter: [
    // Add custom rehype plugins here
  ],
};
