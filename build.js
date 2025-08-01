const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const Terser = require('terser');

// Configuration
const config = {
  // Input files
  cssFiles: ['styles.css'],
  jsFiles: ['script.js'],
  
  // Output directories
  outputDir: 'dist',
  cssOutput: 'styles.min.css',
  jsOutput: 'script.min.js',
  
  // Minification options
  minifyOptions: {
    css: {
      level: 2 // Optimizations with level 2 have the highest compression
    },
    js: {
      compress: true,
      mangle: true,
      output: {
        comments: false
      }
    }
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Minify CSS
async function minifyCSS() {
  try {
    console.log('Minifying CSS files...');
    const cssFiles = config.cssFiles.map(file => fs.readFileSync(file, 'utf8'));
    const cssContent = cssFiles.join('\n');
    
    const output = await new CleanCSS(config.minifyOptions.css).minify(cssContent);
    fs.writeFileSync(path.join(config.outputDir, config.cssOutput), output.styles);
    
    console.log(`CSS minified successfully. Size: ${(output.stats.originalSize / 1024).toFixed(2)}KB -> ${(output.stats.minifiedSize / 1024).toFixed(2)}KB (${output.stats.efficiency * 100}% reduction)`);
    return true;
  } catch (error) {
    console.error('Error minifying CSS:', error);
    return false;
  }
}

// Minify JavaScript
async function minifyJS() {
  try {
    console.log('Minifying JavaScript files...');
    const jsFiles = config.jsFiles.map(file => fs.readFileSync(file, 'utf8'));
    const jsContent = jsFiles.join('\n');
    
    const output = await Terser.minify(jsContent, config.minifyOptions.js);
    
    if (output.error) {
      throw new Error(output.error);
    }
    
    fs.writeFileSync(path.join(config.outputDir, config.jsOutput), output.code);
    
    const originalSize = Buffer.byteLength(jsContent, 'utf8');
    const minifiedSize = Buffer.byteLength(output.code, 'utf8');
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    console.log(`JavaScript minified successfully. Size: ${(originalSize / 1024).toFixed(2)}KB -> ${(minifiedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);
    return true;
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    return false;
  }
}

// Copy HTML and update references
function processHTML() {
  try {
    console.log('Processing HTML file...');
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Update CSS and JS references
    html = html.replace('styles.css', `${config.outputDir}/${config.cssOutput}`);
    html = html.replace('script.js', `${config.outputDir}/${config.jsOutput}`);
    
    // Update image paths if needed
    html = html.replace(/src="(assets\/images\/[^"]+\.(?:png|jpg|jpeg|gif|svg))"/g, 'loading="lazy" src="$1"');
    
    // Write the processed HTML to dist
    fs.writeFileSync(path.join(config.outputDir, 'index.html'), html);
    
    // Copy assets directory
    if (fs.existsSync('assets')) {
      copyDirSync('assets', path.join(config.outputDir, 'assets'));
    }
    
    console.log('HTML processed successfully.');
    return true;
  } catch (error) {
    console.error('Error processing HTML:', error);
    return false;
  }
}

// Helper function to copy directories recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main build function
async function build() {
  console.log('Starting build process...');
  
  // Install dependencies if needed
  try {
    const { execSync } = require('child_process');
    console.log('Installing dependencies...');
    execSync('npm install clean-css terser --save-dev', { stdio: 'inherit' });
  } catch (error) {
    console.log('Dependencies already installed or error occurred.');
  }
  
  // Run build steps
  const cssSuccess = await minifyCSS();
  const jsSuccess = await minifyJS();
  const htmlSuccess = processHTML();
  
  if (cssSuccess && jsSuccess && htmlSuccess) {
    console.log('\n✅ Build completed successfully!');
    console.log(`Output directory: ${path.resolve(config.outputDir)}`);
  } else {
    console.error('\n❌ Build completed with errors.');
    process.exit(1);
  }
}

// Run the build
build().catch(console.error);
