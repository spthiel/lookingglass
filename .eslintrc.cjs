/* eslint-disable no-magic-numbers */
module.exports = {
    root: true,
    env: {node: true},
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
    },
    plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: ["parameter", "variable"],
                leadingUnderscore: "forbid",
                filter: {
                    regex: "_*",
                    match: false,
                },
                format: null,
            },
            {
                selector: "parameter",
                leadingUnderscore: "require",
                format: null,
                modifiers: ["unused"],
            },
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },
    overrides: [],
};
