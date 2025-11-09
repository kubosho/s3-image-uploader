import designSystem from '@o2project/design-system/tailwind.config.js';

const config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: designSystem.colors,
    },
  },
  plugins: [],
};

export default config;
