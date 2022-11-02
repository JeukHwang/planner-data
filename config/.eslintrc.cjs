module.exports = {
    parser: "@typescript-eslint/parser",
    env: { browser: true, node: true, es6: true },
    plugins: ["@typescript-eslint"],
    extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "prettier"],
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
    rules: {
        indent: "off",
        "no-plusplus": ["off", { allowForLoopAfterthoughts: true }],
        "import/extensions": ["off"],
        "import/prefer-default-export": ["off"],
        "no-param-reassign": ["error", { props: false }],
        "lines-between-class-members": ["off"],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/no-var-requires": "off", // just for this file
        "@typescript-eslint/no-non-null-assertion": "warn",
        "no-console": "warn",

        // To prevent conflict with prettier
        // Suggested from eslint-config-prettier        
        // "@typescript-eslint/indent": ["error", 4],
        // "linebreak-style": ["error", "windows"],
        // "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
        // "object-curly-newline": ["error", { multiline: true }],
        // semi: ["error", "always"],
        "max-len": ["warn", { code: 120 }],
        // quotes: ["error", "double"],
        "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }]

    },
    settings: { "import/resolver": { node: { extensions: [".js", ".jsx", ".ts", ".tsx"] } } },
};