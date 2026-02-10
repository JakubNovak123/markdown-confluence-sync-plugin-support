/**
 * Config file usage example
 * Shows how to use markdown-confluence-sync.config.js
 */
const path = require('path');
const { ConfluencePageTransformer } = require('../src/index');

async function configFileExample() {
  console.log('=== Config File Example ===\n');

  // Point to example config file
  const configPath = path.join(__dirname, 'markdown-confluence-sync.config.js');

  const transformer = new ConfluencePageTransformer({
    configPath,
  });

  const markdown = `
# Config File Demo

This example loads configuration from a file.

## Features

- Automatic plugin discovery
- Centralized configuration
- Easy to maintain
  `.trim();

  const adf = await transformer.transform(markdown);

  console.log('Configuration loaded from:', configPath);
  console.log('\nPlugin configuration:');
  const config = transformer.getPluginConfiguration();
  console.log('Remark plugins:', config.remark);
  console.log('Rehype plugins:', config.rehype);

  console.log('\nADF output:');
  console.log(JSON.stringify(adf, null, 2));
}

// Run example
if (require.main === module) {
  configFileExample().catch(console.error);
}

module.exports = { configFileExample };
