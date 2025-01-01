import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["node_modules/", ".aws-sam/", ".idea/"],
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["src/**/*", "__tests__/**/*.ts", "eslint.config.js", "jest.config.ts"],
        plugins: {
            prettier: prettier,
        },
        rules: {
            ...eslintConfigPrettier.rules,
            "prettier/prettier": [
                "error",
                {
                    trailingComma: "es5",
                    tabWidth: 4,
                    semi: true,
                    printWidth: 120,
                },
            ],
        },
    }
);
