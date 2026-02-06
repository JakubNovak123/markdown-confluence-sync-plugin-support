module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'prettier',
    ],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    rules: {
        // Prettier integration
        'prettier/prettier': 'error',

        // Allow console in Node.js project
        'no-console': 'off',

        // Allow devDependencies in tests
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/*.test.js',
                    '**/tests/**/*.js',
                    'jest.config.js',
                ],
            },
        ],

        // Relax some rules for better DX
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-param-reassign': ['error', { props: false }],
    },
};