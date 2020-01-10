const toDefinitionChain = parts => parts.reduce((aggr, curr) => aggr + `["${curr}"]`, '');
const toDefinitiononWindow = (p, value?) => `window${p} = ${value || `window${p} || {};`}`;

const toDeclaration = (path, value?) => {
  return path
    .split('.')
    .map((part, index, path) => path.slice(0,index+1))
    .map(toDefinitionChain)
    .map((chain, index, arr) => {
      if(index === arr.length - 1) {
        return toDefinitiononWindow(chain, value)
      }
      return toDefinitiononWindow(chain)
    }).join('\n');
}

const declare = (path, options = {} as any) => {
  const existing = toDeclaration(options.declared || '');
  return toDeclaration(path, options.value).replace(existing, '')
}


export default declare;