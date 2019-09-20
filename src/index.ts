import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as glob from 'glob';
import * as setValue from 'set-value';
import { watch } from 'chokidar';
import * as merge from 'deepmerge';
import registerHelpers from "./registerHelpers";
import defaultConfig from './defaultConfig';
import { BuildPluginHbsConfig } from './typings/Config';

const createGlobPattern = (array: string[]) => array.length === 1 ? array[0] : `{${array.join(',')}}`;

const compileHbs = (filepath: string, data: any, hbs, config) => {
  const content = fs.readFileSync(filepath, {encoding: 'utf8'});
  const template = hbs.compile(content);
  const targetPath = filepath.substr(filepath.indexOf('/components/') + 1);
      
  fs.createFileSync(`${config.paths.distFolder}/${path.dirname(targetPath)}/${path.basename(targetPath, '.hbs')}.html`);
  fs.writeFileSync(`${config.paths.distFolder}/${path.dirname(targetPath)}/${path.basename(targetPath, '.hbs')}.html`, template({data}));
};

const gatherData = (globString: string): any => {
  const files = glob.sync(globString);
  let collectedData = {};
  files.forEach(filepath => {
    const jsons = fs.readFileSync(filepath, {encoding: 'utf8'});
    setValue(collectedData, filepath.replace('src/', '').replace('.json', '').replace(new RegExp('/', 'g'), '.'), JSON.parse(jsons));
  });
  return collectedData;
}

const registerPartials = (partialPattern: string, hbs) => {
  const files = glob.sync(partialPattern)
  files.forEach(filepath => {
    const partial = fs.readFileSync(filepath, {encoding: 'utf8'})
    const targetPath = filepath.substr(filepath.indexOf('/components/') + 1);
    hbs.registerPartial(path.dirname(targetPath) + '/' + path.basename(targetPath, '.hbs') , partial)
  });
}

export default (pluginOptions: Partial<BuildPluginHbsConfig> = {}) => {
  const pluginConfig = merge(defaultConfig, pluginOptions);
  return async (buildConfig, isServing) => {
    registerHelpers(handlebars);
    const templateData = gatherData(createGlobPattern(pluginConfig.dataPatterns));
    registerPartials(createGlobPattern(pluginConfig.partialPatterns), handlebars)
    
    if(isServing) {
      watch(createGlobPattern(pluginConfig.srcPatterns)).on('all', (err, filepath) => {
        compileHbs(filepath, templateData, buildConfig, handlebars)
      });
    } else {
      glob(createGlobPattern(pluginConfig.srcPatterns), (err, filepaths) => {
        filepaths.forEach(filepath => {
          compileHbs(filepath, templateData, buildConfig, handlebars)
        });
      });
    }
  }
};