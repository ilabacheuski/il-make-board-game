module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "browser": true
    },
    "plugins": ["react"],
    "extends": [
        "standard",
        "plugin:react/recommended",
    ],
    "rules": {
        "comma-dangle": ["error", "always-multiline"],
        "space-before-function-paren": ["error", "never"]
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
};