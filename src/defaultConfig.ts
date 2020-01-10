import { BuildPluginHbsConfig } from './typings/Config';
export default {
  srcPatterns: [
    'src/components/**/scaffolding/*.hbs'
  ],
  partialPatterns: [
    'src/components/**/*.hbs'
  ],
  dataPatterns: [
    'src/components/**/*.json',
    'src/resources/**/*.json'
  ],
  enableRuntimeBuild: false,
  enableRuntimeBuildMinify: true,
  runtimeBuildPath: 'resources/js/handlebars.templates.js',
  runtimeBuildNamespace: 'biotope.configuration.data.tpl',
} as BuildPluginHbsConfig