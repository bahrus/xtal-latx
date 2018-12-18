const jiife = require('jiife');
const root = 'template-instantiation-polyfill/';
const files = [
    'TemplatePart.js', 
    'Anchor.js', 
    'AttributeTemplatePart.js',
'createInstance.js',
'defaultTemplateProcessor.js',
'descendantNodes.js',
'InnerTemplatePart.js',
'NodeTemplatePart.js',
'parseATemplateString.js',
'TemplateInstance.js'
].map(s => root + s);

jiife.processFiles(files, root + 'dist/template-instantiation-polyfill.js', true);