# Markdown Confluence Sync - Plugin Support

> Extended version of `@telefonica/markdown-confluence-sync` with support for custom unified/remark/rehype plugins.

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/JakubNovak123/markdown-confluence-sync-plugin-support)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/JakubNovak123/markdown-confluence-sync-plugin-support)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## 🌟 Features

- ✅ **Plugin Support**: Inject custom unified/remark/rehype plugins before or after built-in plugins
- ✅ **Configuration Files**: JavaScript-based config files for centralized plugin management
- ✅ **Type Safe**: Comprehensive validation of plugin entries and options
- ✅ **Developer Friendly**: Debug utilities to inspect plugin configuration
- ✅ **Well Tested**: 62+ tests with 95%+ code coverage
- ✅ **ESM & CommonJS**: Works with modern ESM packages and CommonJS projects

## 📦 Installation
```bash
npm install markdown-confluence-sync-plugin-support
```

## 🚀 Quick Start

### Basic Usage
```javascript
const { ConfluencePageTransformer } = require('markdown-confluence-sync-plugin-support');

const transformer = new ConfluencePageTransformer();

const markdown = `
# Hello Confluence

This is **bold** and this is *italic*.

- List item 1
- List item 2
`;

const adf = await transformer.transform(markdown);
console.log(adf);
```

### With Custom Plugins
```javascript
const { ConfluencePageTransformer } = require('markdown-confluence-sync-plugin-support');

// Custom remark plugin
function myRemarkPlugin(options) {
  return (tree, file) => {
    // Modify the markdown AST
    console.log('Processing markdown...');
    return tree;
  };
}

// Custom rehype plugin
function myRehypePlugin(options) {
  return (tree, file) => {
    // Modify the HTML AST before ADF conversion
    console.log('Processing HTML...');
    return tree;
  };
}

const transformer = new ConfluencePageTransformer({
  remarkPluginsBefore: [
    [myRemarkPlugin, { option: 'value' }],
  ],
  rehypePluginsAfter: [
    [myRehypePlugin, {}],
  ],
});

const adf = await transformer.transform(markdown);
```

### With Configuration File

Create `markdown-confluence-sync.config.js` in your project root:
```javascript
// markdown-confluence-sync.config.js
const remarkToc = require('remark-toc');
const myCustomPlugin = require('./my-custom-plugin');

module.exports = {
  confluenceBaseUrl: 'https://confluence.example.com',
  spaceKey: 'DOCS',
  
  remarkPluginsBefore: [
    [remarkToc, { maxDepth: 3 }],
  ],
  
  remarkPluginsAfter: [
    [myCustomPlugin, { enabled: true }],
  ],
  
  rehypePluginsBefore: [],
  rehypePluginsAfter: [],
};
```

Then use it:
```javascript
const { ConfluencePageTransformer } = require('markdown-confluence-sync-plugin-support');

const transformer = new ConfluencePageTransformer({
  configPath: './markdown-confluence-sync.config.js',
});

const adf = await transformer.transform(markdown);
```

## 📚 Documentation

### Plugin Configuration

Plugins are applied in this order:

1. `remarkPluginsBefore` - Your custom remark plugins
2. Built-in remark plugins (GFM, Confluence macros)
3. `remarkPluginsAfter` - Your custom remark plugins
4. Markdown → HTML conversion
5. `rehypePluginsBefore` - Your custom rehype plugins
6. Built-in rehype plugins (ADF conversion)
7. `rehypePluginsAfter` - Your custom rehype plugins

### Plugin Format

Each plugin entry is an array: `[plugin, options]`
```javascript
[
  [pluginFunction, { option1: 'value', option2: true }],
]
```

### API Reference

#### `ConfluencePageTransformer`

Main transformer class.

**Constructor Options:**
```typescript
{
  configPath?: string;              // Path to config file
  remarkPluginsBefore?: Array;      // Remark plugins before built-ins
  remarkPluginsAfter?: Array;       // Remark plugins after built-ins
  rehypePluginsBefore?: Array;      // Rehype plugins before built-ins
  rehypePluginsAfter?: Array;       // Rehype plugins after built-ins
}
```

**Methods:**

- `async initialize()` - Initialize transformer (called automatically)
- `async transform(markdown: string)` - Transform markdown to ADF
- `getPluginConfiguration()` - Get current plugin configuration for debugging

**Example:**
```javascript
const transformer = new ConfluencePageTransformer({
  remarkPluginsBefore: [[myPlugin, { option: true }]],
});

await transformer.initialize();
const config = transformer.getPluginConfiguration();
console.log(config);
// { remark: ['myPlugin', 'remarkGfm', ...], rehype: [...] }

const adf = await transformer.transform('# Hello');
```

#### Utility Functions
```javascript
const {
  loadConfig,           // Load config from file
  validateConfig,       // Validate config structure
  validatePluginEntry,  // Validate plugin entry
  mergePlugins,        // Merge plugin arrays
  normalizePluginEntry, // Normalize plugin format
  applyPlugins,        // Apply plugins to processor
} = require('markdown-confluence-sync-plugin-support');
```

## 🎯 Use Cases

### Table of Contents
```javascript
function remarkConfluenceToc(options = {}) {
  const { maxDepth = 3 } = options;
  
  return (tree, file) => {
    // Insert TOC macro marker
    file.data.hasToc = true;
    return tree;
  };
}

function rehypeConfluenceTocAdf(options = {}) {
  return (tree, file) => {
    if (file.data.hasToc && file.data.adf) {
      // Insert Confluence TOC macro into ADF
      const tocMacro = {
        type: 'extension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'toc',
          parameters: {
            macroParams: { maxLevel: options.maxDepth || 3 },
          },
        },
      };
      
      file.data.adf.content.unshift(tocMacro);
    }
    return tree;
  };
}

const transformer = new ConfluencePageTransformer({
  remarkPluginsBefore: [[remarkConfluenceToc, { maxDepth: 3 }]],
  rehypePluginsAfter: [[rehypeConfluenceTocAdf, { maxDepth: 3 }]],
});
```

### Custom Metadata
```javascript
function remarkAddMetadata(options = {}) {
  return (tree, file) => {
    file.data.metadata = {
      author: options.author,
      createdAt: new Date().toISOString(),
      version: options.version || '1.0.0',
    };
    return tree;
  };
}

const transformer = new ConfluencePageTransformer({
  remarkPluginsBefore: [
    [remarkAddMetadata, { author: 'John Doe', version: '2.0.0' }],
  ],
});
```

### Link Transformation
```javascript
function rehypeTransformLinks(options = {}) {
  return (tree) => {
    // Transform all links to open in new tab
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
    return tree;
  };
}

const transformer = new ConfluencePageTransformer({
  rehypePluginsBefore: [[rehypeTransformLinks, {}]],
});
```

## 📖 Examples

See the [`examples/`](./examples) directory for complete working examples:

- **basic-usage.js** - Simple transformation without plugins
- **custom-plugin.js** - Creating and using custom plugins
- **with-config-file.js** - Using configuration files
- **toc-plugin.js** - Practical TOC plugin implementation

Run examples:
```bash
npm run examples          # Run all examples
npm run example:basic     # Run basic example
npm run example:custom    # Run custom plugin example
npm run example:toc       # Run TOC plugin example
```

## 🧪 Testing
```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🔧 Development
```bash
npm install           # Install dependencies
npm run lint          # Lint code
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run format:check  # Check formatting
```

## 📁 Project Structure
```
markdown-confluence-sync-plugin-support/
├── src/
│   ├── index.js                              # Main entry point
│   ├── config/
│   │   └── config-loader.js                  # Config file loader
│   ├── plugins/
│   │   └── plugin-merger.js                  # Plugin merging logic
│   └── transformer/
│       ├── confluence-page-transformer.js    # Main transformer
│       └── plugins/
│           ├── remark-confluence-macros.js   # Built-in remark plugin
│           └── rehype-confluence-adf.js      # Built-in rehype plugin
├── tests/
│   ├── unit/                                 # Unit tests
│   ├── integration/                          # Integration tests
│   └── __mocks__/                            # Mock modules
├── examples/                                 # Usage examples
└── README.md                                 # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Related Projects

- [@telefonica/markdown-confluence-sync](https://github.com/Telefonica/confluence-tools) - Original library
- [unified](https://unifiedjs.com/) - Text processing ecosystem
- [remark](https://github.com/remarkjs/remark) - Markdown processor
- [rehype](https://github.com/rehypejs/rehype) - HTML processor

## 📄 License

ISC

## 🙏 Acknowledgments

This project extends [@telefonica/markdown-confluence-sync](https://github.com/Telefonica/confluence-tools) with plugin support as discussed in [issue #77](https://github.com/Telefonica/confluence-tools/issues/77).

Special thanks to the Telefónica team for the original implementation and the unified ecosystem maintainers.

---

Made with ❤️ by Jakub Novák