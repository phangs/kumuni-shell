import {createWebpackConfig} from '@callstack/repack';

export default createWebpackConfig({
  mode: 'development',
  devServer: {
    // Configuration for the development server
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    // Module Federation plugin configuration
    new (await import('@module-federation/node')).ModuleFederationPlugin({
      name: 'kernel',
      filename: 'kernel.remote.js',
      remotes: {
        // Remotes will be populated dynamically based on master_config
      },
      exposes: {
        // Expose kernel components as needed
        './Kernel': './src/kernel/index',
      },
      shared: {
        // Shared dependencies
        ...require('./package.json').dependencies,
        react: {
          singleton: true,
          requiredVersion: require('./package.json').version,
        },
        'react-native': {
          singleton: true,
          requiredVersion: require('./package.json').version,
        },
      },
    }),
  ],
});