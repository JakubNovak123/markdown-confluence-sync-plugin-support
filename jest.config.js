/**
 * Jest configuration
 */
module.exports = {
    // Use Node environment
    testEnvironment: 'node',

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!**/node_modules/**',
    ],

    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js',
    ],

    // Module paths
    moduleDirectories: ['node_modules', 'src'],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};