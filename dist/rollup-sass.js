'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var rollupPluginutils = require('rollup-pluginutils');

const sass = require('sass');
function RatSass(config = {}) {
    const filter = rollupPluginutils.createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());
    const compile = (styles, overwrite) => {
        try {
            let data = sass.renderSync(Object.assign({
                data: styles,
                includePaths: includes
            }, config, overwrite));
            return {
                css: data.css.toString(),
                map: (data.map || "").toString()
            };
        }
        catch (e) {
            if (e.line && e.column) {
                return {
                    error: e.message,
                    position: {
                        line: e.line,
                        column: e.column
                    }
                };
            }
            else {
                return { error: e.message };
            }
        }
    };
    const transform = function (code, id) {
        if (!filter(id)) {
            return;
        }
        includes.push(path.dirname(id));
        if ('watch' in config) {
            let files = Array.isArray(config.watch) ? config.watch : [config.watch];
            files.forEach((file) => this.addWatchFile(file));
        }
        let emitname = path.basename(id).split('.');
        emitname[emitname.length - 1] = 'css';
        this.emitFile({
            type: 'asset',
            name: emitname.join('.'),
            source: code
        });
        return {
            code: '',
            map: { mappings: '' }
        };
    };
    const generateBundle = function (options, bundle, isWrite) {
        if (typeof config.sourceMap === 'undefined') {
            config.sourceMap = options.sourcemap !== false && options.sourcemap !== 'hidden';
            if (options.sourcemap === 'inline') {
                config.sourceMapEmbed = true;
            }
            if (options.sourcemapExcludeSources) {
                config.sourceMapContents = true;
            }
        }
        let keys = Object.keys(bundle);
        for (let name of keys) {
            if (name.lastIndexOf('.css') !== name.length - 4) {
                continue;
            }
            let file = bundle[name];
            let data = compile(file.source, {
                outFile: name
            });
            if ('error' in data) {
                this.error(data.error, data.position);
                continue;
            }
            file.source = data.css;
            if (data.map && data.map.length > 0) {
                bundle[name + '.map'] = {
                    fileName: file.fileName + '.map',
                    name: file.name + '.map',
                    source: data.map,
                    type: 'asset',
                    isAsset: true
                };
            }
        }
    };
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };
}

function RatSassOutput(config = {}) {
}

function RatSassSkip(config = {}) {
    const filter = rollupPluginutils.createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    return {
        name: 'rat-sass',
        transform(code, id) {
            if (!filter(id)) {
                return;
            }
            return {
                code: '',
                map: { mappings: '' }
            };
        },
        generateBundle(options) {
            return;
        }
    };
}

exports.RatSass = RatSass;
exports.RatSassOutput = RatSassOutput;
exports.RatSassSkip = RatSassSkip;
