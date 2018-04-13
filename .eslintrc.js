module.exports = {
    'extends': 'eslint:recommended',
    'rules': {
        // Clarity
        'eqeqeq': 'error',
        'block-scoped-var': 'error',
        'no-unneeded-ternary': 'warn',
        // Style
        'comma-spacing': [
            'warn',
            {
                'before': false,
                'after': true
            }
        ],
        'comma-dangle': [
            'warn',
            'never'
        ],
        'keyword-spacing': [
            'warn',
            {
                'after': true
            }
        ],
        'linebreak-style': [ 'error', 'unix' ],
        'operator-linebreak': [ 'warn', 'after' ],
        'space-infix-ops': 'warn',
        'space-before-blocks': 'warn',
        'space-before-function-paren': ['warn', 'never'],
        'quotes': [ 'warn', 'single' ]
    },
    'overrides': [
        // Front-end scripts
        {
            'files': ['**/*.js', '.tmp/**/*.js'],
            'env': {
                'browser': true
            },
            'globals': {
                'd3': false,
                'VS': false
            },
            'rules': {
                'semi': 'warn'
            }
        },
        // Node scripts
        {
            'files': ['**/_tests/**/*.js', 'bin/js/**/*.js'],
            'env': {
                'es6': true,
                'node': true,
            },
            'rules': {
                'semi': ['warn', 'never']
            }
        }
    ]
};
