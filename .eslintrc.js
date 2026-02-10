/**
 * ESLint configuration
 */
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
                    '.eslintrc.js',
                    '.prettierrc.js',
                ],
            },
        ],

        // Relax some rules for better DX
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-param-reassign': ['error', { props: false }],

        // CommonJS is fine for config files
        'global-require': 'off',

        // Allow for...of loops (they're fine in Node.js)
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],

        // Allow function hoisting (common pattern in Node.js)
        'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],

        // Allow shadowing in function params
        'no-shadow': ['error', { allow: ['err', 'resolve', 'reject', 'done', 'cb', 'options', 'config'] }],

        // Allow unused vars with underscore prefix
        'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

        // Allow case declarations
        'no-case-declarations': 'off',
    },
};