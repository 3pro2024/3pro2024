import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["dist", "components", ".ropeproject"],
  },

  // Base configs for all files
  ...tseslint.configs.recommended,

  // Source files (browser)
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Config files (node)
  {
    files: ['*.cjs', '*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Allow require() in JS/CJS files
    }
  }
);
