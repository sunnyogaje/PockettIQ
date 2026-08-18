import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The React Compiler's set-state-in-effect diagnostic flags the
      // standard "reset local form state when a controlled sheet/dialog
      // reopens" pattern and "read a browser-only API on mount" pattern
      // used throughout this app's Sheet/Dialog forms and PWA install
      // detection — both are intentional and don't cause the cascading
      // render issue this rule targets. Downgraded to a warning rather
      // than disabled outright so genuinely new anti-patterns still surface.
      "react-hooks/set-state-in-effect": "warn",
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
