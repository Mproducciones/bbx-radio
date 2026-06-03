import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Capacitor Android — artefactos generados (el código fuente está en java/res)
    "android/**/build/**",
    "android/app/build/**",
    "android/capacitor-cordova-android-plugins/**",
    "android/app/src/main/assets/public/**",
  ]),
]);

export default eslintConfig;
