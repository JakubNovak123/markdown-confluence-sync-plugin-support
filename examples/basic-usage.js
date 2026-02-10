/**
 * Basic usage example
 * Shows how to use ConfluencePageTransformer without custom plugins
 */
const { ConfluencePageTransformer } = require('../src/index');

async function basicExample() {
  console.log('=== Basic Usage Example ===\n');

  const transformer = new ConfluencePageTransformer();

  const markdown = `
# Welcome to Confluence

This is a **simple** example with:

- Lists
- **Bold** text
- *Italic* text
- [Links](https://example.com)

## Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, Confluence!');
}
\`\`\`
  `.trim();

  // Transform to ADF
  const adf = await transformer.transform(markdown);

  console.log('Markdown input:');
  console.log(markdown);
  console.log('\n---\n');
  console.log('ADF output:');
  console.log(JSON.stringify(adf, null, 2));
}

// Run example
if (require.main === module) {
  basicExample().catch(console.error);
}

module.exports = { basicExample };
