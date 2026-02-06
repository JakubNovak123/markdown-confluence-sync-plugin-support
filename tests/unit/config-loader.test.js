/**
 * Tests for configuration loader
 */
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const {
    loadConfig,
    validateConfig,
    validatePluginEntry,
    CONFIG_FILE_NAMES,
} = require('../../src/config/config-loader');

describe('Config Loader', () => {
    const testConfigDir = path.join(__dirname, '../fixtures/configs');

    beforeEach(() => {
        // Create test directory
        if (!fs.existsSync(testConfigDir)) {
            fs.mkdirSync(testConfigDir, { recursive: true });
        }
    });

    afterEach(() => {
        // Cleanup test files
        if (fs.existsSync(testConfigDir)) {
            const files = fs.readdirSync(testConfigDir);
            files.forEach((file) => {
                fs.unlinkSync(path.join(testConfigDir, file));
            });
        }

        // Clear require cache
        Object.keys(require.cache).forEach((key) => {
            if (key.includes('fixtures/configs')) {
                delete require.cache[key];
            }
        });
    });

    describe('CONFIG_FILE_NAMES', () => {
        it('should export array of supported config file names', () => {
            expect(Array.isArray(CONFIG_FILE_NAMES)).toBe(true);
            expect(CONFIG_FILE_NAMES.length).toBeGreaterThan(0);
            expect(CONFIG_FILE_NAMES).toContain('markdown-confluence-sync.config.js');
        });
    });

    describe('loadConfig', () => {
        it('should load valid CommonJS config file', async () => {
            const configPath = path.join(testConfigDir, 'valid.config.js');
            const mockPlugin = () => {};
            const configContent = `
        module.exports = {
          confluenceBaseUrl: 'https://example.com',
          remarkPluginsBefore: [
            [${mockPlugin.toString()}, { option: true }],
          ],
        };
      `;

            fs.writeFileSync(configPath, configContent);

            const config = await loadConfig(configPath);

            expect(config).toBeDefined();
            expect(config.confluenceBaseUrl).toBe('https://example.com');
            expect(config.remarkPluginsBefore).toHaveLength(1);
            expect(typeof config.remarkPluginsBefore[0][0]).toBe('function');
            expect(config.remarkPluginsBefore[0][1]).toEqual({ option: true });
        });

        it('should return null if config file does not exist', async () => {
            const nonExistentPath = path.join(testConfigDir, 'nonexistent.config.js');

            const config = await loadConfig(nonExistentPath);

            expect(config).toBeNull();
        });

        it('should throw error for invalid JavaScript syntax', async () => {
            const configPath = path.join(testConfigDir, 'invalid-syntax.config.js');
            fs.writeFileSync(configPath, 'this is { not valid JavaScript');

            await expect(loadConfig(configPath)).rejects.toThrow();
        });

        it('should throw error for config that is not an object', async () => {
            const configPath = path.join(testConfigDir, 'not-object.config.js');
            fs.writeFileSync(configPath, 'module.exports = "string";');

            await expect(loadConfig(configPath)).rejects.toThrow('Config must be an object');
        });

        it('should handle config with only some plugin arrays', async () => {
            const configPath = path.join(testConfigDir, 'partial.config.js');
            const configContent = `
        module.exports = {
          remarkPluginsBefore: [],
          // remarkPluginsAfter not provided
        };
      `;

            fs.writeFileSync(configPath, configContent);

            const config = await loadConfig(configPath);

            expect(config).toBeDefined();
            expect(config.remarkPluginsBefore).toEqual([]);
            expect(config.remarkPluginsAfter).toBeUndefined();
        });

        it('should auto-discover config in current directory', async () => {
            // Save current directory
            const originalCwd = process.cwd();

            try {
                // Change to test directory
                process.chdir(testConfigDir);

                // Create config file with standard name
                const configContent = `
          module.exports = {
            autoDiscovered: true,
          };
        `;
                fs.writeFileSync(
                    path.join(testConfigDir, 'markdown-confluence-sync.config.js'),
                    configContent
                );

                const config = await loadConfig();

                expect(config).toBeDefined();
                expect(config.autoDiscovered).toBe(true);
            } finally {
                // Restore original directory
                process.chdir(originalCwd);
            }
        });
    });

    describe('validateConfig', () => {
        it('should accept valid config with all plugin arrays', () => {
            const config = {
                remarkPluginsBefore: [[() => {}, {}]],
                remarkPluginsAfter: [],
                rehypePluginsBefore: [[() => {}, { opt: 1 }]],
                rehypePluginsAfter: [],
            };

            expect(() => validateConfig(config)).not.toThrow();
        });

        it('should accept empty config object', () => {
            const config = {};

            expect(() => validateConfig(config)).not.toThrow();
        });

        it('should accept config with extra properties', () => {
            const config = {
                confluenceBaseUrl: 'https://example.com',
                spaceKey: 'TEST',
                remarkPluginsBefore: [],
            };

            expect(() => validateConfig(config)).not.toThrow();
        });

        it('should throw error if config is null', () => {
            expect(() => validateConfig(null)).toThrow('Config must be an object');
        });

        it('should throw error if config is undefined', () => {
            expect(() => validateConfig(undefined)).toThrow('Config must be an object');
        });

        it('should throw error if config is not an object', () => {
            expect(() => validateConfig('string')).toThrow('Config must be an object');
            expect(() => validateConfig(123)).toThrow('Config must be an object');
            expect(() => validateConfig([])).toThrow('Config must be an object');
        });

        it('should throw error if plugin array is not an array', () => {
            const config = {
                remarkPluginsBefore: 'not an array',
            };

            expect(() => validateConfig(config)).toThrow("'remarkPluginsBefore' must be an array");
        });

        it('should throw error if plugin array contains invalid entries', () => {
            const config = {
                remarkPluginsBefore: [
                    'invalid entry', // Should be array
                ],
            };

            expect(() => validateConfig(config)).toThrow();
        });
    });

    describe('validatePluginEntry', () => {
        it('should accept plugin as array with function only', () => {
            const entry = [() => {}];

            expect(() => validatePluginEntry(entry, 'test[0]')).not.toThrow();
        });

        it('should accept plugin as array with function and options', () => {
            const entry = [() => {}, { option1: true, option2: 'value' }];

            expect(() => validatePluginEntry(entry, 'test[0]')).not.toThrow();
        });

        it('should accept plugin with empty options object', () => {
            const entry = [() => {}, {}];

            expect(() => validatePluginEntry(entry, 'test[0]')).not.toThrow();
        });

        it('should throw error if entry is not an array', () => {
            expect(() => validatePluginEntry('not array', 'test[0]')).toThrow('must be an array');
            expect(() => validatePluginEntry({}, 'test[0]')).toThrow('must be an array');
            expect(() => validatePluginEntry(null, 'test[0]')).toThrow('must be an array');
        });

        it('should throw error if entry is empty array', () => {
            const entry = [];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow(
                'must have 1 or 2 elements'
            );
        });

        it('should throw error if entry has more than 2 elements', () => {
            const entry = [() => {}, {}, 'extra'];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow(
                'must have 1 or 2 elements'
            );
        });

        it('should throw error if plugin is not a function', () => {
            const entry = ['not a function'];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow('must be a function');
        });

        it('should throw error if options is not an object', () => {
            const entry = [() => {}, 'not an object'];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow('must be an object');
        });

        it('should throw error if options is null', () => {
            const entry = [() => {}, null];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow('must be an object');
        });

        it('should throw error if options is an array', () => {
            const entry = [() => {}, []];

            expect(() => validatePluginEntry(entry, 'test[0]')).toThrow('must be an object');
        });

        it('should include path in error messages', () => {
            const entry = ['not a function'];

            expect(() => validatePluginEntry(entry, 'remarkPluginsBefore[3]')).toThrow(
                'remarkPluginsBefore[3]'
            );
        });
    });
});