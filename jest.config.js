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
            branches: 65,
            functions: 80,
            lines: 75,
            statements: 75,
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