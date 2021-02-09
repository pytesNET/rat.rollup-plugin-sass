import { dirname, basename } from 'path';
import { createFilter } from 'rollup-pluginutils';

function RatSassOutput(config = {}) {
    const sass = require('sass');
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());
    const setParentOptions = (parent) => {
        for (let key in parent) {
            parent[key];
        }
    };
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
            if (name.lastIndexOf(':css') !== name.length - 4) {
                continue;
            }
            let file = bundle[name];
            file.fileName = file.fileName.substr(0, file.fileName.length - 4);
            if (config.outputStyle === 'compressed') {
                file.fileName = file.fileName.replace('.css', '.min.css');
            }
            if (typeof config.prefix !== 'undefined') {
                if (typeof config.prefix === 'function') {
                    file.source = config.prefix.call(file.name) + file.source;
                }
                else {
                    file.source = config.prefix + file.source;
                }
            }
            var data = compile(file.source, {
                outFile: name
            });
            if ('error' in data) {
                this.error(data.error, data.position);
                continue;
            }
            if (data.map && data.map.length > 0) {
                if (typeof config.sourceMapUrls !== 'undefined' && config.sourceMapUrls !== false) {
                    let json = JSON.parse(data.map);
                    json.sources = json.sources.map((url) => {
                        if (typeof config.sourceMapUrls === 'function') {
                            return config.sourceMapUrls.call(url);
                        }
                        else {
                            if (url === 'stdin') {
                                url = name;
                            }
                            url = url.replace(/^file\:\/+/, '').replace(process.cwd().replace(/\\/g, '/'), '.');
                            return url;
                        }
                    });
                    data.map = JSON.stringify(json);
                }
            }
            if (typeof config.banner !== 'undefined') {
                if (typeof config.banner === 'function') {
                    data.css = config.banner(file.name) + "\n" + data.css;
                }
                else {
                    data.css = config.banner + "\n" + data.css;
                }
            }
            if (typeof config.footer !== 'undefined') {
                if (typeof config.footer === 'function') {
                    var footer = config.footer(file.name) + "\n" + data.css;
                }
                else {
                    var footer = config.footer;
                }
                let offset = data.css.lastIndexOf('/*#');
                if (offset < 0) {
                    data.css += "\n" + footer;
                }
                else {
                    data.css = data.css.substr(0, offset) + footer + "\n" + data.css.substr(offset);
                }
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
        name: "rat-sass-output",
        generateBundle,
        setParentOptions
    };
}

function RatSass(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const chunks = { length: 0, reference: undefined };
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());
    const transform = function (code, id) {
        if (!filter(id)) {
            return;
        }
        includes.push(dirname(id));
        if ('watch' in config) {
            let files = Array.isArray(config.watch) ? config.watch : [config.watch];
            files.forEach((file) => this.addWatchFile(file));
        }
        if (typeof config.fileNames !== 'undefined') {
            let emitname = basename(id).split('.');
            emitname.pop();
            var emitdata = {
                type: 'asset',
                fileName: config.fileNames.replace(/\[name\]/g, emitname.join('.')).replace(/\[extname\]/g, '.css') + ':css',
                source: code
            };
        }
        else {
            let emitname = basename(id).split('.');
            emitname[emitname.length - 1] = 'css';
            var emitdata = {
                type: 'asset',
                name: emitname.join('.'),
                source: code
            };
        }
        if (!config.bundle) {
            this.emitFile(emitdata);
        }
        else {
            if (typeof chunks.reference === 'undefined') {
                chunks.reference = this.emitFile(emitdata);
            }
            chunks[chunks.length++] = code;
        }
        return {
            code: '',
            map: { mappings: '' }
        };
    };
    const generateBundle = function (options, bundle, isWrite) {
        let skipOutput = false;
        for (let plugin in options.plugins) {
            if (options.plugins[plugin].name === 'rat-sass-output') {
                skipOutput = true;
                break;
            }
        }
        if (!skipOutput) {
            RatSassOutput(config).generateBundle(options, bundle, isWrite);
        }
    };
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };
}

function RatSassSkip(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
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

export { RatSass, RatSassOutput, RatSassSkip };
