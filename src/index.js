/**
 * Main entry point for markdown-confluence-sync-plugin-support
 */
const {
  ConfluencePageTransformer,
  BUILTIN_REMARK_PLUGINS,
  BUILTIN_REHYPE_PLUGINS,
} = require('./transformer/confluence-page-transformer');
const { loadConfig, validateConfig, validatePluginEntry } = require('./config/config-loader');
const { mergePlugins, normalizePluginEntry, applyPlugins } = require('./plugins/plugin-merger');

module.exports = {
  // Main transformer class
  ConfluencePageTransformer,

  // Built-in plugins
  BUILTIN_REMARK_PLUGINS,
  BUILTIN_REHYPE_PLUGINS,

  // Config utilities
  loadConfig,
  validateConfig,
  validatePluginEntry,

  // Plugin utilities
  mergePlugins,
  normalizePluginEntry,
  applyPlugins,
};
