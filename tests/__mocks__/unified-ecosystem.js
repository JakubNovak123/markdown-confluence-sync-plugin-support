/**
 * Mock unified ecosystem for testing
 * This allows us to test plugin logic without actual unified dependencies
 */

/**
 * Create mock unified processor
 */
function createMockProcessor() {
  const plugins = [];

  const processor = {
    use(plugin, options = {}) {
      plugins.push({ plugin, options });
      return processor;
    },

    async process(markdown) {
      // Call all registered plugins
      let tree = { type: 'root', children: [] };
      const file = { data: {} };

      for (const { plugin, options } of plugins) {
        const transformer = plugin(options);
        if (transformer && typeof transformer === 'function') {
          const result = transformer(tree, file);
          if (result) tree = result;
        }
      }

      // If no ADF was set, create default one
      if (!file.data.adf) {
        file.data.adf = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Mock ADF output',
                },
              ],
            },
          ],
        };
      }

      return {
        data: file.data,
        result: tree,
      };
    },

    _plugins: plugins, // For testing
  };

  return processor;
}

function mockUnified() {
  return createMockProcessor();
}

function mockRemarkParse() {
  // Mock plugin that does nothing
  return () => {};
}

function mockRemarkGfm() {
  // Mock plugin that does nothing
  return () => {};
}

function mockRemarkRehype() {
  // Mock plugin that does nothing
  return () => {};
}

module.exports = {
  unified: mockUnified,
  remarkParse: mockRemarkParse,
  remarkGfm: mockRemarkGfm,
  remarkRehype: mockRemarkRehype,
};