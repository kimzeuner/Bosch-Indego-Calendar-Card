import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        CSS: "readonly",
        CustomEvent: "readonly",
        HTMLElement: "readonly",
        customElements: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
  },
];
