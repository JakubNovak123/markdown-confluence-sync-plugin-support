/**
 * Configuration loader for markdown-confluence-sync
 * Loads and validates JS/CJS/MJS config files
 */
const path = require('path');
const fs = require('fs');

/**
 * Supported config file names in order of precedence
 * @type {string[]}
 */
const CONFIG_FILE_NAMES = [
  'markdown-confluence-sync.config.js',
  'markdown-confluence-sync.config.cjs',
  'markdown-confluence-sync.config.mjs',
];

/**
 * Load configuration from JS config file
 *
 * @param {string} [configPath] - Optional explicit path to config file
 * @returns {Promise<Object|null>} Configuration object or null if not found
 * @throws {Error} If config file exists but cannot be loaded or is invalid
 */
async function loadConfig(configPath) {
  let resolvedPath = configPath;

  // If no explicit path provided, auto-discover in current directory
  if (!resolvedPath) {
    const cwd = process.cwd();

    for (const fileName of CONFIG_FILE_NAMES) {
      const candidatePath = path.join(cwd, fileName);
      if (fs.existsSync(candidatePath)) {
        resolvedPath = candidatePath;
        break;
      }
    }
  }

  // No config file found
  if (!resolvedPath) {
    return null;
  }

  // Verify file exists
  if (!fs.existsSync(resolvedPath)) {
    return null;
  }

  // Load the config file
  let config;
  try {
    // Handle both ESM and CJS
    if (resolvedPath.endsWith('.mjs')) {
      // ESM import
      const imported = await import(resolvedPath);
      config = imported.default || imported;
    } else {
      // CommonJS require
      // Clear require cache to allow reloading
      const absolutePath = path.resolve(resolvedPath);
      delete require.cache[absolutePath];
      // eslint-disable-next-line import/no-dynamic-require
      config = require(absolutePath);
    }
  } catch (error) {
    throw new Error(`Failed to load config file ${resolvedPath}: ${error.message}`);
  }

  // Validate config structure
  validateConfig(config);

  return config;
}

/**
 * Validate configuration object structure
 *
 * @param {*} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  // Check if config is an object
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('Config must be an object');
  }

  // Plugin array keys to validate
  const pluginArrayKeys = [
    'remarkPluginsBefore',
    'remarkPluginsAfter',
    'rehypePluginsBefore',
    'rehypePluginsAfter',
  ];

  // Validate each plugin array if present
  for (const key of pluginArrayKeys) {
    if (config[key] !== undefined) {
      // Check if it's an array
      if (!Array.isArray(config[key])) {
        throw new Error(`Config option '${key}' must be an array`);
      }

      // Validate each entry in the array
      config[key].forEach((entry, index) => {
        validatePluginEntry(entry, `${key}[${index}]`);
      });
    }
  }
}

/**
 * Validate individual plugin entry
 *
 * @param {*} entry - Plugin entry to validate
 * @param {string} pathDesc - Path description for error messages
 * @throws {Error} If plugin entry is invalid
 */
function validatePluginEntry(entry, pathDesc) {
  // Entry must be an array
  if (!Array.isArray(entry)) {
    throw new Error(`Plugin entry at ${pathDesc} must be an array [plugin, options?]`);
  }

  // Entry must have 1 or 2 elements: [plugin] or [plugin, options]
  if (entry.length === 0 || entry.length > 2) {
    throw new Error(`Plugin entry at ${pathDesc} must have 1 or 2 elements [plugin, options?]`);
  }

  const [plugin, options] = entry;

  // First element must be a function
  if (typeof plugin !== 'function') {
    throw new Error(`Plugin at ${pathDesc}[0] must be a function, got ${typeof plugin}`);
  }

  // Second element (if present) must be an object
  if (options !== undefined) {
    if (typeof options !== 'object' || options === null || Array.isArray(options)) {
      throw new Error(`Plugin options at ${pathDesc}[1] must be an object if provided`);
    }
  }
}

module.exports = {
  loadConfig,
  validateConfig,
  validatePluginEntry,
  CONFIG_FILE_NAMES,
};
