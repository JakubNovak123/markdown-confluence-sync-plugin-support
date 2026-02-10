/**
 * Mock unified ecosystem for testing
 * This allows us to test plugin logic without actual unified dependencies
 */

/**
 * Create mock unified processor
 */
function createMockProcessor() {
  const plugins = [];
  let compilerFn = null;

  const processor = {
    use(plugin, options = {}) {
      plugins.push({ plugin, options });

      // Call plugin to check if it sets a Compiler
      const context = {
        Compiler: null,
      };

      plugin.call(context, options);

      // If plugin set a Compiler, store it
      if (context.Compiler) {
        compilerFn = context.Compiler;
      }

      return processor;
    },

    async process(_markdown) {
      // Call all registered plugins
      let tree = { type: 'root', children: [] };
      const file = { data: {} };

      plugins.forEach(({ plugin, options }) => {
        const context = {
          Compiler: compilerFn,
        };

        const transformer = plugin.call(context, options);

        // Update compiler if plugin set one
        if (context.Compiler) {
          compilerFn = context.Compiler;
        }

        if (transformer && typeof transformer === 'function') {
          const result = transformer(tree, file);
          if (result) tree = result;
        }
      });

      // If we have a compiler, use it
      let result = tree;
      if (compilerFn) {
        result = compilerFn(tree);
      }

      // If compiler produced ADF, store it
      if (result && result.type === 'doc') {
        file.data.adf = result;
      } else if (!file.data.adf) {
        // Default ADF if no compiler
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
        result,
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
