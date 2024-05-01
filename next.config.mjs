import pkg from './package.json' assert { type: 'json' }
const deps = pkg.dependencies;

const remotes = function (isServer) {
    const location = isServer ? 'ssr' : 'chunks';
    return {
        // specify remotes
        remote: `remote@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
    };
}

const shareConfig = {
    react: {
        singleton: true,
        requiredVersion: deps.react,
        eager: true
      },
      'react-dom': {
        singleton: true,
        requiredVersion: deps['react-dom'],
        eager: true
      }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    webpack: (config, options) => {
        const { webpack, isServer } = options
        const { ModuleFederationPlugin } = webpack.container

        // Add Plugins
        config.plugins.push(
            new ModuleFederationPlugin({
                name: 'remote',
                filename: 'static/chunks/remoteEntry.js',
                remotes: remotes(isServer),
                shared: shareConfig,
                exposes: {
                    './Button': './src/components/Button'
                }
            })
        )

        return config
    }
}
export default nextConfig;