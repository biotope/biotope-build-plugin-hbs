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
} as BuildPluginHbsConfig