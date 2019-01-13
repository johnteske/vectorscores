module.exports = {
  extends: "eslint:recommended",
  rules: {
    //
    "no-undef": 1,
    "no-unused-vars": 1,
    // Clarity
    eqeqeq: "error",
    "block-scoped-var": "error",
    "no-unneeded-ternary": "warn",
    // Style
    "comma-spacing": [
      "warn",
      {
        before: false,
        after: true
      }
    ],
    "comma-dangle": ["warn", "never"],
    "keyword-spacing": [
      "warn",
      {
        after: true
      }
    ],
    "linebreak-style": ["error", "unix"],
    "operator-linebreak": ["warn", "after"],
    "space-infix-ops": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", "never"]
    // 'quotes': [ 'warn', 'single' ]
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  overrides: [
    // Front-end scripts
    {
      files: ["**/*.js", ".tmp/**/*.js"],
      env: {
        browser: true
      },
      globals: {
        d3: false,
        VS: false
      },
      rules: {
        // semi: "warn"
      }
    },
    // Node scripts
    {
      files: ["**/_tests/**/*.js", "bin/js/**/*.js"],
      env: {
        es6: true,
        node: true
      },
      rules: {
        "no-console": 0
        // semi: ["warn", "never"]
      }
    },
    // 11ty
    {
      files: ["**.11ty.js"],
      env: {
        es6: true,
        node: true
      },
      rules: {
        "no-console": 0
        // semi: ["warn", "never"]
      }
    }
  ]
};
