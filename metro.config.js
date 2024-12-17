const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add "react-native-webview" as an assetExts extension
defaultConfig.resolver.assetExts.push('webview');

module.exports = mergeConfig(defaultConfig, {
    resolver: {
        sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
        extraNodeModules: {
            'react-native-webview': require.resolve('react-native-webview'),
        },
    },
});
