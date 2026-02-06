/**
 * Plugin merger utilities
 * Handles merging and normalization of unified/remark/rehype plugins
 */

/**
 * Merge user plugins with built-in plugins in correct order
 *
 * Order: pluginsBefore -> builtInPlugins -> pluginsAfter
 *
 * @param {Array<Array>} [pluginsBefore=[]] - User plugins to run before built-ins
 * @param {Array<Array>} [builtInPlugins=[]] - Built-in plugins
 * @param {Array<Array>} [pluginsAfter=[]] - User plugins to run after built-ins
 * @returns {Array<Array>} Merged plugin array
 */
function mergePlugins(pluginsBefore = [], builtInPlugins = [], pluginsAfter = []) {
    return [
        ...(pluginsBefore || []),
        ...(builtInPlugins || []),
        ...(pluginsAfter || []),
    ];
}

/**
 * Normalize plugin entry to standard [plugin, options] format
 *
 * Accepts:
 * - Function: `myPlugin` → `[myPlugin, {}]`
 * - Array with function: `[myPlugin]` → `[myPlugin, {}]`
 * - Array with function and options: `[myPlugin, {opt: true}]` → unchanged
 *
 * @param {Function|Array} entry - Plugin entry to normalize
 * @returns {Array} Normalized [plugin, options] tuple
 * @throws {Error} If entry is invalid format
 */
function normalizePluginEntry(entry) {
    // If it's a function, wrap it in array with empty options
    if (typeof entry === 'function') {
        return [entry, {}];
    }

    // If it's an array, validate and normalize
    if (Array.isArray(entry)) {
        const [plugin, options = {}] = entry;
        return [plugin, options];
    }

    // Invalid entry type
    throw new Error(`Invalid plugin entry: ${typeof entry}`);
}

/**
 * Apply plugins to a unified processor
 *
 * Normalizes and applies each plugin in order, maintaining chainability
 *
 * @param {Object} processor - Unified processor instance
 * @param {Array<Function|Array>} plugins - Array of plugin entries
 * @returns {Object} Processor with plugins applied (for chaining)
 */
function applyPlugins(processor, plugins) {
    let result = processor;

    for (const entry of plugins) {
        const [plugin, options] = normalizePluginEntry(entry);
        result = result.use(plugin, options);
    }

    return result;
}

module.exports = {
    mergePlugins,
    normalizePluginEntry,
    applyPlugins,
};