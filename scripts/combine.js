const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const isDebug = process.argv.includes('--debug');
const baseDir = path.join(__dirname, '..');
const buildDir = path.join(baseDir, 'dist');
const wasmFile = path.join(buildDir, isDebug ? 'xslt-wasm-debug.js' : 'xslt-wasm.js');
const polyfillSrc = path.join(baseDir, 'src', 'xslt-polyfill-src.js');
const outputFile = path.join(baseDir, 'xslt-polyfill.min.js');
const copyrightFile = path.join(baseDir, 'COPYRIGHT');

async function build() {
    console.log('--- Building in ' + (isDebug ? 'DEBUG' : 'RELEASE') + ' mode ---');
    const wasmContent = fs.readFileSync(wasmFile, 'utf8');
    const polyfillContent = fs.readFileSync(polyfillSrc, 'utf8');
    const combinedContent = wasmContent + '\n' + polyfillContent;

    const minified = await minify(combinedContent, {
        compress: true,
        mangle: true
    });

    const copyright = fs.readFileSync(copyrightFile, 'utf8');
    fs.writeFileSync(outputFile, copyright + '\n' + minified.code);
    console.log('--- Minified output to ' + outputFile + ' ---');
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
