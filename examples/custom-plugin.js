/**
 * Custom plugin example
 * Shows how to add custom remark/rehype plugins
 */
const { ConfluencePageTransformer } = require('../src/index');

/**
 * Example custom remark plugin that adds metadata
 */
function remarkAddMetadata(options = {}) {
  return function transformer(tree, file) {
    // Add custom metadata to the AST
    file.data.customMetadata = {
      author: options.author || 'Unknown',
      processedAt: new Date().toISOString(),
      pluginVersion: '1.0.0',
    };

    console.log('Custom remark plugin executed with options:', options);
    return tree;
  };
}

/**
 * Example custom rehype plugin that logs processing
 */
function rehypeLogger(_options = {}) {
  return function transformer(tree, file) {
    console.log('Custom rehype plugin executed');
    console.log('Metadata from remark plugin:', file.data.customMetadata);
    return tree;
  };
}

async function customPluginExample() {
  console.log('=== Custom Plugin Example ===\n');

  const transformer = new ConfluencePageTransformer({
    remarkPluginsBefore: [[remarkAddMetadata, { author: 'John Doe' }]],
    rehypePluginsAfter: [[rehypeLogger, {}]],
  });

  const markdown = `
# Custom Plugin Demo

This example demonstrates custom plugin execution.
  `.trim();

  const adf = await transformer.transform(markdown);

  console.log('\nADF output:');
  console.log(JSON.stringify(adf, null, 2));

  // Show plugin configuration
  console.log('\nPlugin configuration:');
  const config = transformer.getPluginConfiguration();
  console.log('Remark plugins:', config.remark);
  console.log('Rehype plugins:', config.rehype);
}

// Run example
if (require.main === module) {
  customPluginExample().catch(console.error);
}

module.exports = { customPluginExample, remarkAddMetadata, rehypeLogger };
