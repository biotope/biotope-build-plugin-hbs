import * as uglifyjs from '@node-minify/uglify-js';
import * as minify from '@node-minify/core';
import { BuildPluginHbsConfig } from './typings/Config';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import declare from './helpers/declare';
import registerHelpers from "./registerHelpers";

const createGlobPattern = (array: string[]) => array.length === 1 ? array[0] : `{${array.join(',')}}`;

const precompileRuntimeTemplates = (templatePattern: string, hbs, namespace: string): string => {
  const files = glob.sync(templatePattern);
  const precompiled = files.map((filepath) => {
    const content = fs.readFileSync(filepath, {encoding: 'utf8'});
    return declare(`${namespace}.${path.basename(filepath).replace(path.extname(filepath), '')}`, {declared: namespace, value: `Handlebars.template(${hbs.precompile(content)})`});
  });
  return precompiled.join('');
}

const precompileRuntimePartials = (partialPattern: string, hbs): string => {
  const files = glob.sync(partialPattern);
  const precompiled = files.map((filepath) => {
    const content = fs.readFileSync(filepath, {encoding: 'utf8'});
    return `Handlebars.registerPartial('${path.basename(filepath, path.extname(filepath))}', Handlebars.template(${hbs.precompile(content)}));`;
  });
  return precompiled.join('');
}

const createRuntimeScript = (config: BuildPluginHbsConfig, hbs, targetPath: string) => {
  const script = `(function (root, factory) {if (typeof module === \'object\' && module.exports) {module.exports = factory(require(\'handlebars\'));} else {factory(root.Handlebars);}}(this, function (Handlebars) { (${registerHelpers})(Handlebars);\n ${declare(config.runtimeBuildNamespace)}\n${precompileRuntimePartials(createGlobPattern(config.partialPatterns), hbs)}\n${precompileRuntimeTemplates(createGlobPattern(config.srcPatterns), hbs, config.runtimeBuildNamespace)} }));`
  fs.outputFileSync(targetPath, script);
      if(config.enableRuntimeBuildMinify) {
        minify({
          compressor: uglifyjs,
          input: targetPath,
          output: targetPath,
          callback: function(err, min) {
            console.error(err);
          }
        });
      }
}

export default createRuntimeScript;