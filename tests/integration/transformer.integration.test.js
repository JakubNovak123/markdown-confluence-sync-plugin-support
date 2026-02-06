/**
 * Integration tests for ConfluencePageTransformer with plugin support
 */
const { describe, it, expect, beforeEach } = require('@jest/globals');
const {
    ConfluencePageTransformer,
    resetModules
} = require('../../src/transformer/confluence-page-transformer');

describe('ConfluencePageTransformer Integration', () => {
    process.env.NODE_ENV = 'test';
    describe('Basic Functionality', () => {
        it('should create transformer instance', () => {
            const transformer = new ConfluencePageTransformer();

            expect(transformer).toBeDefined();
            expect(transformer).toBeInstanceOf(ConfluencePageTransformer);
        });

        it('should transform simple markdown to ADF', async () => {
            const transformer = new ConfluencePageTransformer();

            const markdown = '# Hello World\n\nThis is a test.';
            const result = await transformer.transform(markdown);

            expect(result).toBeDefined();
            expect(result.type).toBe('doc');
            expect(result.version).toBe(1);
        });

        it('should handle empty markdown', async () => {
            const transformer = new ConfluencePageTransformer();

            const result = await transformer.transform('');

            expect(result).toBeDefined();
        });
    });

    describe('Plugin Support', () => {
        it('should apply custom remark plugins before built-ins', async () => {
            let pluginCalled = false;
            let pluginOrder = [];

            const customPlugin = () => {
                return (tree) => {
                    pluginCalled = true;
                    pluginOrder.push('custom');
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [customPlugin, {}],
                ],
            });

            await transformer.transform('# Test');

            expect(pluginCalled).toBe(true);
        });

        it('should apply custom remark plugins after built-ins', async () => {
            let pluginCalled = false;

            const customPlugin = () => {
                return (tree) => {
                    pluginCalled = true;
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsAfter: [
                    [customPlugin, {}],
                ],
            });

            await transformer.transform('# Test');

            expect(pluginCalled).toBe(true);
        });

        it('should apply custom rehype plugins before built-ins', async () => {
            let pluginCalled = false;

            const customPlugin = () => {
                return (tree) => {
                    pluginCalled = true;
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                rehypePluginsBefore: [
                    [customPlugin, {}],
                ],
            });

            await transformer.transform('# Test');

            expect(pluginCalled).toBe(true);
        });

        it('should apply custom rehype plugins after built-ins', async () => {
            let pluginCalled = false;

            const customPlugin = () => {
                return (tree) => {
                    pluginCalled = true;
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                rehypePluginsAfter: [
                    [customPlugin, {}],
                ],
            });

            await transformer.transform('# Test');

            expect(pluginCalled).toBe(true);
        });

        it('should pass plugin options correctly', async () => {
            let receivedOptions = null;

            const customPlugin = (options) => {
                receivedOptions = options;
                return (tree) => tree;
            };

            const expectedOptions = { key: 'value', nested: { prop: true } };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [customPlugin, expectedOptions],
                ],
            });

            await transformer.transform('# Test');

            expect(receivedOptions).toEqual(expectedOptions);
        });

        it('should apply multiple custom plugins in order', async () => {
            const callOrder = [];

            const plugin1 = () => {
                return (tree) => {
                    callOrder.push('plugin1');
                    return tree;
                };
            };

            const plugin2 = () => {
                return (tree) => {
                    callOrder.push('plugin2');
                    return tree;
                };
            };

            const plugin3 = () => {
                return (tree) => {
                    callOrder.push('plugin3');
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [plugin1, {}],
                    [plugin2, {}],
                ],
                remarkPluginsAfter: [
                    [plugin3, {}],
                ],
            });

            await transformer.transform('# Test');

            expect(callOrder).toEqual(['plugin1', 'plugin2', 'plugin3']);
        });
    });

    describe('Configuration Loading', () => {
        it('should initialize only once', async () => {
            const transformer = new ConfluencePageTransformer();

            await transformer.initialize();
            await transformer.initialize(); // Should not re-initialize

            expect(transformer.initialized).toBe(true);
        });

        it('should merge options with loaded config', async () => {
            let plugin1Called = false;
            let plugin2Called = false;

            const plugin1 = () => {
                return (tree) => {
                    plugin1Called = true;
                    return tree;
                };
            };

            const plugin2 = () => {
                return (tree) => {
                    plugin2Called = true;
                    return tree;
                };
            };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [[plugin1, {}]],
                remarkPluginsAfter: [[plugin2, {}]],
            });

            await transformer.transform('# Test');

            expect(plugin1Called).toBe(true);
            expect(plugin2Called).toBe(true);
        });
    });

    describe('Plugin Configuration Debugging', () => {
        it('should provide plugin configuration for debugging', async () => {
            const customPlugin = () => {};
            customPlugin.displayName = 'customPlugin';

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [customPlugin, {}],
                ],
            });

            await transformer.initialize();
            const config = transformer.getPluginConfiguration();

            expect(config).toBeDefined();
            expect(config.remark).toBeDefined();
            expect(Array.isArray(config.remark)).toBe(true);
            expect(config.rehype).toBeDefined();
            expect(Array.isArray(config.rehype)).toBe(true);
        });

        it('should list plugin names in configuration', async () => {
            const namedPlugin = () => {};
            namedPlugin.displayName = 'myCustomPlugin';

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [namedPlugin, {}],
                ],
            });

            await transformer.initialize();
            const config = transformer.getPluginConfiguration();

            expect(config.remark).toContain('myCustomPlugin');
        });
    });

    describe('Error Handling', () => {
        it('should handle plugin errors gracefully', async () => {
            const errorPlugin = () => {
                return () => {
                    throw new Error('Plugin error');
                };
            };

            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [
                    [errorPlugin, {}],
                ],
            });

            await expect(transformer.transform('# Test')).rejects.toThrow();
        });

        it('should handle empty plugin arrays', async () => {
            const transformer = new ConfluencePageTransformer({
                remarkPluginsBefore: [],
                remarkPluginsAfter: [],
                rehypePluginsBefore: [],
                rehypePluginsAfter: [],
            });

            const result = await transformer.transform('# Test');

            expect(result).toBeDefined();
        });
    });
});