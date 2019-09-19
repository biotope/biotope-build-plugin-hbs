import * as fs from 'fs-extra';
import * as path from 'path';
import * as hbs from 'handlebars';
import * as glob from 'glob';
import * as setValue from 'set-value';
import { watch } from 'chokidar';
import * as merge from 'deepmerge';
import registerHelpers from "./registerHelpers";
import defaultConfig from './defaultConfig';
import { BuildPluginHbsConfig } from './typings/Config';

const createGlobPattern = (array: string[]) => array.length === 1 ? array[0] : `{${array.join(',')}}`;

const compileHbs = (filepath: string, data: any, config) => {
  const content = fs.readFileSync(filepath, {encoding: 'utf8'});
  const template = hbs.compile(content);
  const targetPath = filepath.substr(filepath.indexOf('/components/') + 1);
      
  fs.createFileSync(`${config.paths.distFolder}/${path.dirname(targetPath)}/${path.basename(targetPath, '.hbs')}.html`);
  fs.writeFileSync(`${config.paths.distFolder}/${path.dirname(targetPath)}/${path.basename(targetPath, '.hbs')}.html`, template({data}));
};

export default (pluginOptions: Partial<BuildPluginHbsConfig> = {}) => {
  const pluginConfig = merge(defaultConfig, pluginOptions);
  return (buildConfig, isServing) => {
    registerHelpers(hbs);
    const data = {};
    
    glob(createGlobPattern(pluginConfig.dataPatterns), (err, files) => {
      console.log('Data ', files);
      
      files.forEach(filepath => {
        const jsons = fs.readFileSync(filepath, {encoding: 'utf8'});
        setValue(data, filepath.replace('src/', '').replace('.json', '').replace(new RegExp('/', 'g'), '.'), JSON.parse(jsons));
      });
    })
    glob(createGlobPattern(pluginConfig.partialPatterns), (err, files) => {
      console.log('Files ', files);
      
      files.forEach(filepath => {
        const partial = fs.readFileSync(filepath, {encoding: 'utf8'})
        const targetPath = filepath.substr(filepath.indexOf('/components/') + 1);
        hbs.registerPartial(path.dirname(targetPath) + '/' + path.basename(targetPath, '.hbs') , partial)
      });
    })
    if(isServing) {
      watch(createGlobPattern(pluginConfig.srcPatterns)).on('all', (err, filepath) => {
        compileHbs(filepath, data, buildConfig)
      });
    } else {
      glob(createGlobPattern(pluginConfig.srcPatterns), (err, filepaths) => {
        filepaths.forEach(filepath => {
          compileHbs(filepath, data, buildConfig)
        });
      });
    }
  }
};