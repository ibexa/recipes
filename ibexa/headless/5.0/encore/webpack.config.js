const Encore = require('@symfony/webpack-encore');
const path = require('path');
const getIbexaConfig = require('./ibexa.webpack.config.js');
const ibexaConfig = getIbexaConfig(Encore);
const customConfigs = require('./ibexa.webpack.custom.configs.js');

Encore.reset();
Encore.setOutputPath('public/build/')
    .setPublicPath('/build')
    .enableSassLoader()
    .enableReactPreset()
    .enableSingleRuntimeChunk()
    .copyFiles({
        from: './assets/images',
        to: 'images/[path][name].[ext]',
        pattern: /\.(png|svg)$/,
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    });

// Welcome page stylesheets
Encore.addEntry('welcome-page-css', [
    path.resolve(__dirname, './assets/scss/welcome-page.scss'),
]);

// Welcome page javascripts
Encore.addEntry('welcome-page-js', [
    path.resolve(__dirname, './assets/js/welcome.page.js'),
]);

Encore.addEntry('app', './assets/app.js');

const projectConfig = Encore.getWebpackConfig();

projectConfig.name = 'app';

module.exports = [ibexaConfig, ...customConfigs, projectConfig];
