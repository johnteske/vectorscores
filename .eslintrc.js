module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        // "indent": [
        //     "warn",
        //     4
        // ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "comma-spacing": [
            "error",
            { "before": false, "after": true }
        ],
        "operator-linebreak": [
            "error",
            "after"
        ],
        "space-infix-ops": "error",
        "no-unneeded-ternary": "warn",
        "no-undef": [
            "warn"
        ]
    },
    "globals": {
        "d3": false,
        "VS": false
    }
};
