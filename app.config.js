import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    name: "Pandora",
    slug: "pandora",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./src/assets/icons/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    splash: {
      image: "./src/assets/icons/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mkjox.pandora",
      icon: "./src/assets/icons/icon.png",
    },
    android: {
      userInterfaceStyle: "automatic",
      package: "com.mkjox.pandora",
      versionCode: 1,
      icon: "./src/assets/icons/icon.png",
      adaptiveIcon: {
        foregroundImage: "./src/assets/icons/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./src/assets/icons/favicon.png",
    },
    plugins: ["expo-font", "expo-secure-store"],
    extra: {
      eas: {
        projectId: "85f3dbb4-697b-4f8c-9405-9ed04b1123d1",
      },
      apiUrl: process.env.API_URL,
    },
    owner: "mkjox",
  },
});
