## Plugin Support

You can extend the Markdown to Confluence conversion with custom [unified](https://unifiedjs.com/), [remark](https://github.com/remarkjs/remark), and [rehype](https://github.com/rehypejs/rehype) plugins.

### Configuration

Create a JavaScript configuration file in your project root:

**markdown-confluence-sync.config.js**
```javascript
const remarkToc = require('remark-toc');
const myCustomPlugin = require('./my-custom-plugin');

module.exports = {
  // Your existing configuration
  confluenceBaseUrl: 'https://confluence.example.com',
  spaceKey: 'DOCS',
  
  // Plugin configuration
  remarkPluginsBefore: [
    // Plugins that run BEFORE built-in remark plugins
    [remarkToc, { maxDepth: 3 }],
  ],
  remarkPluginsAfter: [
    // Plugins that run AFTER built-in remark plugins
    [myCustomPlugin, { option: 'value' }],
  ],
  rehypePluginsBefore: [
    // Plugins that run BEFORE built-in rehype plugins
  ],
  rehypePluginsAfter: [
    // Plugins that run AFTER built-in rehype plugins
  ],
};
```

### Plugin Format

Each plugin entry is an array: `[plugin, options]`

- `plugin`: A unified/remark/rehype plugin function
- `options`: (Optional) Configuration object for the plugin

### Execution Order

Plugins are applied in this order:

1. `remarkPluginsBefore` - your custom remark plugins
2. Built-in remark plugins (GFM, Confluence macros, etc.)
3. `remarkPluginsAfter` - your custom remark plugins
4. Markdown → HTML conversion
5. `rehypePluginsBefore` - your custom rehype plugins
6. Built-in rehype plugins (ADF conversion, etc.)
7. `rehypePluginsAfter` - your custom rehype plugins

### Example: Adding Table of Contents
```javascript
const remarkToc = require('remark-toc');

module.exports = {
  remarkPluginsBefore: [
    [remarkToc, { 
      heading: 'Contents',
      maxDepth: 3,
      tight: true,
    }],
  ],
};
```

### Programmatic Usage

You can also provide plugins programmatically:
```javascript
const { ConfluencePageTransformer } = require('@telefonica/markdown-confluence-sync');
const myPlugin = require('./my-plugin');

const transformer = new ConfluencePageTransformer({
  remarkPluginsAfter: [
    [myPlugin, { custom: true }],
  ],
});

const adf = await transformer.transform('# My Document');
```

### Debugging

Get the current plugin configuration:
```javascript
const config = transformer.getPluginConfiguration();
console.log(config);
// { remark: ['remarkGfm', 'remarkConfluenceMacros', 'myPlugin'], rehype: [...] }
```