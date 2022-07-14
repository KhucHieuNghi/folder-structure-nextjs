const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");

function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath));
  while (true) {
    if (fs.existsSync(path.join(currDir, "package.json"))) {
      return currDir;
    }
    const { dir, root } = path.parse(currDir);
    if (dir === root) {
      throw new Error(
        `Could not find package.json in the parent directories starting from ${filepath}.`
      );
    }
    currDir = dir;
  }
}

module.exports = {
    stories: [
      '../src/components/**/**/*stories.mdx',
      '../src/components/**/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
      '@storybook/addon-links',
      '@storybook/addon-essentials',
      'storybook-addon-next',
    ],
    framework: '@storybook/react',
    core: {
      builder: 'webpack5',
    },
    webpackFinal: async (config) => {
      config.module.rules.push({
        test: /\.scss$/,
        use: ['sass-loader',
        //  'style-loader', 'css-loader'
        ],
        include: path.resolve(__dirname, '../src/styles/'),
      })

      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        include: path.resolve(__dirname, '.babelrc'),
        // options: {
        //   presets: [['react-app', { flow: false, typescript: true }]],
        // },
      })
  
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve('./src'),
      ]
  
      config.resolve.extensions.push('.ts', '.tsx')
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, "../src/"),
      };
      return merge(config, {
        resolve: {
          alias: {
            "@emotion/core": getPackageDir("@emotion/react"),
            "@emotion/styled": getPackageDir("@emotion/styled"),
            "emotion-theming": getPackageDir("@emotion/react"),
          },
        },
      });
    },  
}