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
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js',
    ],

    // Module paths
    moduleDirectories: ['node_modules', 'src'],

    // Setup files
    // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};