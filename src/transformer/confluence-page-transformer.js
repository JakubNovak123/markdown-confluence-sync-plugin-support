/**
 * Confluence Page Transformer
 * Transforms Markdown to Confluence ADF format with plugin support
 */
const { loadConfig } = require('../config/config-loader');
const { mergePlugins, applyPlugins } = require('../plugins/plugin-merger');

// Built-in plugins (CommonJS)
const remarkConfluenceMacros = require('./plugins/remark-confluence-macros');
const rehypeConfluenceAdf = require('./plugins/rehype-confluence-adf');

// ESM modules - will be loaded dynamically or mocked in tests
let unifiedModule;
let remarkParseModule;
let remarkGfmModule;
let remarkRehypeModule;
let modulesLoaded = false;

/**
 * Reset loaded modules (for testing)
 */
function resetModules() {
  unifiedModule = undefined;
  remarkParseModule = undefined;
  remarkGfmModule = undefined;
  remarkRehypeModule = undefined;
  modulesLoaded = false;
}

/**
 * Load ESM modules dynamically (singleton pattern)
 * In tests, these will be mocked
 *
 * @returns {Promise<void>}
 */
async function loadESMModules() {
  if (modulesLoaded) {
    return; // Already loaded
  }

  // Check if running in test environment
  const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

  if (isTest) {
    // Use mocks in test environment
    try {
      const mocks = require('../../tests/__mocks__/unified-ecosystem');
      unifiedModule = mocks.unified;
      remarkParseModule = mocks.remarkParse;
      remarkGfmModule = mocks.remarkGfm;
      remarkRehypeModule = mocks.remarkRehype;
      modulesLoaded = true;
      return;
    } catch (e) {
      // Mocks not available, fall through to dynamic import
      // This shouldn't happen in tests but we handle it gracefully
    }
  }

  // Production: load real ESM modules
  try {
    const [unified, remarkParse, remarkGfm, remarkRehype] = await Promise.all([
      import('unified'),
      import('remark-parse'),
      import('remark-gfm'),
      import('remark-rehype'),
    ]);

    unifiedModule = unified.unified;
    remarkParseModule = remarkParse.default;
    remarkGfmModule = remarkGfm.default;
    remarkRehypeModule = remarkRehype.default;
    modulesLoaded = true;
  } catch (error) {
    throw new Error(`Failed to load unified modules: ${error.message}`);
  }
}

/**
 * Get built-in remark plugins
 *
 * @returns {Array<Array>} Built-in remark plugins
 */
function getBuiltinRemarkPlugins() {
  return [
    [remarkGfmModule, {}],
    [remarkConfluenceMacros, {}],
  ];
}

/**
 * Built-in rehype plugins in default order
 * @type {Array<Array>}
 */
const BUILTIN_REHYPE_PLUGINS = [[rehypeConfluenceAdf, {}]];

/**
 * Confluence Page Transformer class
 * Handles transformation of Markdown to Confluence ADF with plugin support
 */
class ConfluencePageTransformer {
  /**
   * Create a new transformer instance
   *
   * @param {Object} [options={}] - Transformer options
   * @param {string} [options.configPath] - Optional path to config file
   * @param {Array<Array>} [options.remarkPluginsBefore] - Remark plugins before built-ins
   * @param {Array<Array>} [options.remarkPluginsAfter] - Remark plugins after built-ins
   * @param {Array<Array>} [options.rehypePluginsBefore] - Rehype plugins before built-ins
   * @param {Array<Array>} [options.rehypePluginsAfter] - Rehype plugins after built-ins
   */
  constructor(options = {}) {
    this.options = options;
    this.config = null;
    this.initialized = false;
    this.remarkPlugins = null;
    this.rehypePlugins = null;
  }

  /**
   * Initialize transformer with configuration
   * Loads ESM modules and config file, merges with options
   *
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    // Load ESM modules first
    await loadESMModules();

    // Load config from file if not provided directly
    if (!this.config) {
      this.config = await loadConfig(this.options.configPath);
    }

    // Merge config from file with options (options take precedence)
    const remarkPluginsBefore =
      this.options.remarkPluginsBefore || this.config?.remarkPluginsBefore || [];
    const remarkPluginsAfter =
      this.options.remarkPluginsAfter || this.config?.remarkPluginsAfter || [];
    const rehypePluginsBefore =
      this.options.rehypePluginsBefore || this.config?.rehypePluginsBefore || [];
    const rehypePluginsAfter =
      this.options.rehypePluginsAfter || this.config?.rehypePluginsAfter || [];

    // Get built-in plugins (now that ESM modules are loaded)
    const builtinRemarkPlugins = getBuiltinRemarkPlugins();

    // Merge plugins in correct order
    this.remarkPlugins = mergePlugins(
      remarkPluginsBefore,
      builtinRemarkPlugins,
      remarkPluginsAfter,
    );

    this.rehypePlugins = mergePlugins(
      rehypePluginsBefore,
      BUILTIN_REHYPE_PLUGINS,
      rehypePluginsAfter,
    );

    this.initialized = true;
  }

  /**
   * Transform markdown to Confluence ADF
   *
   * @param {string} markdown - Markdown content to transform
   * @returns {Promise<Object>} Confluence ADF object
   */
  async transform(markdown) {
    await this.initialize();

    // Create unified processor
    let processor = unifiedModule().use(remarkParseModule);

    // Apply remark plugins
    processor = applyPlugins(processor, this.remarkPlugins);

    // Convert to rehype (markdown -> HTML AST)
    processor = processor.use(remarkRehypeModule);

    // Apply rehype plugins
    processor = applyPlugins(processor, this.rehypePlugins);

    // Process the markdown
    const file = await processor.process(markdown);

    // Return ADF from file.data (set by rehype-confluence-adf plugin)
    return file.data.adf || file.result;
  }

  /**
   * Get current plugin configuration for debugging
   *
   * @returns {Object} Current plugin configuration with plugin names
   */
  getPluginConfiguration() {
    if (!this.initialized) {
      return {
        remark: [],
        rehype: [],
      };
    }

    return {
      remark: this.remarkPlugins.map(
        ([plugin]) => plugin.displayName || plugin.name || 'anonymous',
      ),
      rehype: this.rehypePlugins.map(
        ([plugin]) => plugin.displayName || plugin.name || 'anonymous',
      ),
    };
  }
}

// Export built-in plugins as getter functions since they're loaded async
module.exports = {
  ConfluencePageTransformer,
  resetModules, // Export for testing
  get BUILTIN_REMARK_PLUGINS() {
    return remarkGfmModule ? getBuiltinRemarkPlugins() : [];
  },
  BUILTIN_REHYPE_PLUGINS,
};
