module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@context": "./src/context",
            "@screens": "./src/screens",
            "@redux": "./src/redux",
            "@services": "./src/services",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@config": "./src/config",
            "@hooks": "./src/hooks",
            "@navigation": "./src/navigation"
          }
        }
      ]
    ]
  };
};
