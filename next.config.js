const {
  withModuleFederation,
  MergeRuntime,
} = require("@module-federation/nextjs-mf");
const path = require("path");

module.exports = {
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = options;
    const mfConf = {
      name: "host",
      library: { type: config.output.libraryTarget, name: "host" },
      filename: "static/runtime/remoteEntry.js",
      // This is where we configure the remotes we want to consume.
      // We will be using this in Client.
      remotes: {
        // this defines our remote app name space, so we will be able to
        // import from 'client'
        client: isServer
          ? path.resolve(
              __dirname,
              "../client/.next/server/static/runtime/remoteEntry.js"
            )
          : "client", // for host, treat it as a global
      },
      // as the name suggests, this is what we are going to expose
      exposes: {},
      // over here we can put a list of modules we would like to share
      shared: [],
    };

    // Configures ModuleFederation and other Webpack properties
    withModuleFederation(config, options, mfConf);

    config.plugins.push(new MergeRuntime());

    if (!isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }

    return config;
  },
};
