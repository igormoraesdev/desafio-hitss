const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Arquivos .svg passam a ser importados como componentes React
// em vez de assets de imagem.
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer/expo',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts.push('svg');

module.exports = config;
