import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The magazine page renderer is a copy of the admin's src/magazine, kept
  // identical so it can be copied over again when the builder changes. Its
  // photos come from the API at any size, inside pages that scale.
  {
    files: ["src/features/magazine/renderer/**"],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
