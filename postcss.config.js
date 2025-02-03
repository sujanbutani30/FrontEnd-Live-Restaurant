// postcss.config.js
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    ...(process.env.NODE_ENV === 'production' ? [
      purgecss({
        content: [
          './src/**/*.html',
          './src/**/*.js',
          './src/**/*.jsx',
          './src/**/*.ts',
          './src/**/*.tsx',
          './src/**/*.css', 
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      })
    ] : []),
  ],
};
