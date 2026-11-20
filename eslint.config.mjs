import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    files: ["src/components/city/**/*.{ts,tsx}"],
    rules: {
      "react/no-unknown-property": "off",
    },
  },
];

export default config;
