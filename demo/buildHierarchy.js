// Modified version of Chris Bateman's Webpack Visualizer buildHierarchy
// https://github.com/chrisbateman/webpack-visualizer/blob/master/src/shared/buildHierarchy.js
export default function buildHierarchy(modules) {
  const root = {
    name: 'root',
    children: []
  };

  modules.forEach((module) => {
    // remove module if index is null or issued by extract-text-plugin
    const extractInIdentifier = module.identifier.indexOf() !== -1;
    const extractInIssuer = module.issuer && module.issuer.indexOf('extract-text-webpack-plugin') !== -1;
    if (extractInIdentifier || extractInIssuer || module.index === null) {
      return;
    }

    const mod = {
      id: module.id,
      fullName: module.name,
      size: module.size
    };

    let fileName = mod.fullName;
    const beginning = mod.fullName.substring(0, 2);

    if (beginning === './') {
      fileName = fileName.substring(2);
    }

    getFile(mod, fileName, root);
  });

  sumNodes(root);

  return root;
}

function getFile(module, fileName, parentTree) {
  let charIndex = fileName.indexOf('/');

  if (charIndex !== -1) {
    let folder = fileName.slice(0, charIndex);

    if (folder === '~') {
      folder = 'node_modules';
    }

    let childFolder = getChild(parentTree.children, folder);

    if (!childFolder) {
      childFolder = {
        name: folder,
        children: []
      };

      parentTree.children.push(childFolder);
    }

    getFile(module, fileName.slice(charIndex + 1), childFolder);
  } else {
    module.name = fileName;
    parentTree.children.push(module);
  }
}

function getChild(arr, name) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === name) {
      return arr[i];
    }
  }
}

function sumNodes(node) {
  if (node.children && node.children.length > 0) {
    node.size = 0;
    for (var i = 0; i < node.children.length; i++) {
      node.size += sumNodes(node.children[i]);
    }
  }
  return node.size;
}
