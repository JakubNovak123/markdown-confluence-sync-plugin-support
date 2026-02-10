/**
 * Tests for rehype-confluence-adf plugin
 */
const { describe, it, expect } = require('@jest/globals');

// Mock the production modules by setting test environment
const originalEnv = process.env.NODE_ENV;

describe('rehype-confluence-adf', () => {
    let rehypeConfluenceAdf;

    beforeAll(() => {
        // Load production plugin
        process.env.NODE_ENV = 'production';
        rehypeConfluenceAdf = require('../../src/transformer/plugins/rehype-confluence-adf');
    });

    afterAll(() => {
        process.env.NODE_ENV = originalEnv;
    });

    it('should export a function', () => {
        expect(typeof rehypeConfluenceAdf).toBe('function');
    });

    it('should set a Compiler when called', () => {
        const context = {};
        rehypeConfluenceAdf.call(context);

        expect(context.Compiler).toBeDefined();
        expect(typeof context.Compiler).toBe('function');
    });

    it('should convert simple paragraph to ADF', () => {
        const context = {};
        rehypeConfluenceAdf.call(context);

        const tree = {
            type: 'root',
            children: [
                {
                    type: 'element',
                    tagName: 'p',
                    children: [
                        { type: 'text', value: 'Hello world' }
                    ]
                }
            ]
        };

        const result = context.Compiler(tree);

        expect(result).toEqual({
            version: 1,
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello world'
                        }
                    ]
                }
            ]
        });
    });

    it('should convert headings to ADF', () => {
        const context = {};
        rehypeConfluenceAdf.call(context);

        const tree = {
            type: 'root',
            children: [
                {
                    type: 'element',
                    tagName: 'h1',
                    children: [{ type: 'text', value: 'Title' }]
                }
            ]
        };

        const result = context.Compiler(tree);

        expect(result.content[0]).toMatchObject({
            type: 'heading',
            attrs: { level: 1 }
        });
    });
});