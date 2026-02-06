/**
 * Tests for plugin merger
 */
const { describe, it, expect } = require('@jest/globals');
const {
    mergePlugins,
    normalizePluginEntry,
    applyPlugins,
} = require('../../src/plugins/plugin-merger');

describe('Plugin Merger', () => {
    describe('mergePlugins', () => {
        it('should merge plugins in correct order: before -> builtin -> after', () => {
            const pluginBefore = () => 'before';
            const pluginBuiltin = () => 'builtin';
            const pluginAfter = () => 'after';

            const before = [[pluginBefore, {}]];
            const builtin = [[pluginBuiltin, {}]];
            const after = [[pluginAfter, {}]];

            const merged = mergePlugins(before, builtin, after);

            expect(merged).toHaveLength(3);
            expect(merged[0][0]()).toBe('before');
            expect(merged[1][0]()).toBe('builtin');
            expect(merged[2][0]()).toBe('after');
        });

        it('should handle empty before array', () => {
            const builtin = [[() => 'builtin', {}]];
            const after = [[() => 'after', {}]];

            const merged = mergePlugins([], builtin, after);

            expect(merged).toHaveLength(2);
            expect(merged[0][0]()).toBe('builtin');
            expect(merged[1][0]()).toBe('after');
        });

        it('should handle empty after array', () => {
            const before = [[() => 'before', {}]];
            const builtin = [[() => 'builtin', {}]];

            const merged = mergePlugins(before, builtin, []);

            expect(merged).toHaveLength(2);
            expect(merged[0][0]()).toBe('before');
            expect(merged[1][0]()).toBe('builtin');
        });

        it('should handle empty builtin array', () => {
            const before = [[() => 'before', {}]];
            const after = [[() => 'after', {}]];

            const merged = mergePlugins(before, [], after);

            expect(merged).toHaveLength(2);
            expect(merged[0][0]()).toBe('before');
            expect(merged[1][0]()).toBe('after');
        });

        it('should handle all empty arrays', () => {
            const merged = mergePlugins([], [], []);

            expect(merged).toEqual([]);
        });

        it('should handle undefined arguments', () => {
            const builtin = [[() => 'builtin', {}]];

            const merged = mergePlugins(undefined, builtin, undefined);

            expect(merged).toHaveLength(1);
            expect(merged[0][0]()).toBe('builtin');
        });

        it('should preserve plugin options', () => {
            const plugin1 = () => {};
            const plugin2 = () => {};
            const options1 = { key1: 'value1' };
            const options2 = { key2: 'value2' };

            const before = [[plugin1, options1]];
            const builtin = [[plugin2, options2]];

            const merged = mergePlugins(before, builtin, []);

            expect(merged[0][1]).toBe(options1);
            expect(merged[1][1]).toBe(options2);
        });

        it('should handle multiple plugins in each category', () => {
            const before = [
                [() => 'before1', {}],
                [() => 'before2', {}],
            ];
            const builtin = [
                [() => 'builtin1', {}],
                [() => 'builtin2', {}],
                [() => 'builtin3', {}],
            ];
            const after = [
                [() => 'after1', {}],
            ];

            const merged = mergePlugins(before, builtin, after);

            expect(merged).toHaveLength(6);
            expect(merged[0][0]()).toBe('before1');
            expect(merged[1][0]()).toBe('before2');
            expect(merged[2][0]()).toBe('builtin1');
            expect(merged[3][0]()).toBe('builtin2');
            expect(merged[4][0]()).toBe('builtin3');
            expect(merged[5][0]()).toBe('after1');
        });
    });

    describe('normalizePluginEntry', () => {
        it('should normalize function to [function, {}]', () => {
            const plugin = () => {};

            const normalized = normalizePluginEntry(plugin);

            expect(normalized).toHaveLength(2);
            expect(normalized[0]).toBe(plugin);
            expect(normalized[1]).toEqual({});
        });

        it('should normalize [function] to [function, {}]', () => {
            const plugin = () => {};

            const normalized = normalizePluginEntry([plugin]);

            expect(normalized).toHaveLength(2);
            expect(normalized[0]).toBe(plugin);
            expect(normalized[1]).toEqual({});
        });

        it('should keep [function, options] as is', () => {
            const plugin = () => {};
            const options = { key: 'value', nested: { prop: true } };

            const normalized = normalizePluginEntry([plugin, options]);

            expect(normalized).toHaveLength(2);
            expect(normalized[0]).toBe(plugin);
            expect(normalized[1]).toBe(options);
        });

        it('should handle [function, {}] correctly', () => {
            const plugin = () => {};
            const options = {};

            const normalized = normalizePluginEntry([plugin, options]);

            expect(normalized).toHaveLength(2);
            expect(normalized[0]).toBe(plugin);
            expect(normalized[1]).toBe(options);
        });

        it('should throw error for invalid entry types', () => {
            expect(() => normalizePluginEntry('invalid')).toThrow('Invalid plugin entry');
            expect(() => normalizePluginEntry(123)).toThrow('Invalid plugin entry');
            expect(() => normalizePluginEntry(null)).toThrow('Invalid plugin entry');
            expect(() => normalizePluginEntry(undefined)).toThrow('Invalid plugin entry');
        });

        it('should throw error for object (not array)', () => {
            expect(() => normalizePluginEntry({ plugin: () => {} })).toThrow('Invalid plugin entry');
        });
    });

    describe('applyPlugins', () => {
        it('should apply plugins to processor in order', () => {
            const calls = [];
            const mockProcessor = {
                use: jest.fn((plugin, options) => {
                    calls.push({ plugin: plugin.name || 'anonymous', options });
                    return mockProcessor;
                }),
            };

            const plugin1 = () => {};
            plugin1.name = 'plugin1';
            const plugin2 = () => {};
            plugin2.name = 'plugin2';

            const plugins = [
                [plugin1, { opt1: true }],
                [plugin2, { opt2: false }],
            ];

            const result = applyPlugins(mockProcessor, plugins);

            expect(result).toBe(mockProcessor);
            expect(mockProcessor.use).toHaveBeenCalledTimes(2);
            expect(mockProcessor.use).toHaveBeenNthCalledWith(1, plugin1, { opt1: true });
            expect(mockProcessor.use).toHaveBeenNthCalledWith(2, plugin2, { opt2: false });
            expect(calls).toHaveLength(2);
            expect(calls[0]).toEqual({ plugin: 'plugin1', options: { opt1: true } });
            expect(calls[1]).toEqual({ plugin: 'plugin2', options: { opt2: false } });
        });

        it('should handle empty plugin array', () => {
            const mockProcessor = {
                use: jest.fn().mockReturnThis(),
            };

            const result = applyPlugins(mockProcessor, []);

            expect(result).toBe(mockProcessor);
            expect(mockProcessor.use).not.toHaveBeenCalled();
        });

        it('should normalize plugin entries before applying', () => {
            const mockProcessor = {
                use: jest.fn().mockReturnThis(),
            };

            const plugin = () => {};
            // Pass just function (not normalized yet)
            const plugins = [plugin];

            const result = applyPlugins(mockProcessor, plugins);

            expect(result).toBe(mockProcessor);
            expect(mockProcessor.use).toHaveBeenCalledTimes(1);
            expect(mockProcessor.use).toHaveBeenCalledWith(plugin, {});
        });

        it('should chain processor calls', () => {
            let chainCount = 0;
            const mockProcessor = {
                use: jest.fn(() => {
                    chainCount += 1;
                    return mockProcessor;
                }),
            };

            const plugins = [
                [() => {}, {}],
                [() => {}, {}],
                [() => {}, {}],
            ];

            applyPlugins(mockProcessor, plugins);

            expect(chainCount).toBe(3);
        });

        it('should handle plugins with complex options', () => {
            const mockProcessor = {
                use: jest.fn().mockReturnThis(),
            };

            const plugin = () => {};
            const complexOptions = {
                nested: {
                    deep: {
                        value: 'test',
                    },
                },
                array: [1, 2, 3],
                boolean: true,
                null: null,
            };

            const plugins = [[plugin, complexOptions]];

            applyPlugins(mockProcessor, plugins);

            expect(mockProcessor.use).toHaveBeenCalledWith(plugin, complexOptions);
        });
    });
});