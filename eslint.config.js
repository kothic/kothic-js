const js = require('@eslint/js');

module.exports = [
    {
        ignores: [
            'src/utils/rbush.js'
        ]
    },
    js.configs.recommended,
    {
        files: [
            'Gruntfile.js',
            'debug/kothic-include.js',
            'src/**/*.js',
            'tests/**/*.js'
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                __dirname: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly',
                document: 'readonly',
                Image: 'readonly',
                module: 'readonly',
                process: 'readonly',
                require: 'readonly',
                setTimeout: 'readonly',
                URL: 'readonly',
                window: 'readonly',
                L: 'readonly',
                Kothic: 'readonly',
                MapCSS: 'readonly',
                rbush: 'readonly'
            }
        },
        rules: {
            eqeqeq: 'error',
            'no-new': 'error',
            'no-prototype-builtins': 'off',
            'no-redeclare': 'off',
            'no-unused-vars': ['error', {
                args: 'none'
            }]
        }
    }
];
