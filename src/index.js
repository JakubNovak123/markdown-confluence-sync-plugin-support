/**
 * Main entry point for markdown-confluence-sync-plugin-support
 */
const { ConfluencePageTransformer } = require('./transformer/confluence-page-transformer');
const { loadConfig } = require('./config/config-loader');
const { mergePlugins } = require('./plugins/plugin-merger');

module.exports = {
  ConfluencePageTransformer,
  loadConfig,
  mergePlugins,
};
