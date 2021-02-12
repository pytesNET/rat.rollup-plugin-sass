import { basename, dirname } from 'path';
import { createFilter } from 'rollup-pluginutils';

function RatSassOutput(config = {}) {
    const sass = require('sass');
    var instance = null;
    var includes = [process.cwd()];
    const compile = (styles, overwrite) => {
        try {
            let data = sass.renderSync(Object.assign({
                data: styles,
                includePaths: includes
            }, config, overwrite));
            data.css = data.css.toString();
            return {
                css: data.css,
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
    const _setInstance = function (ratInstance, ratIncludes) {
        instance = ratInstance;
        includes = ratIncludes;
    };
    const renderStart = function (outputOptions, inputOptions) {
        instance = null;
        includes = [process.cwd()];
        for (let key in inputOptions.plugins) {
            if (inputOptions.plugins[key].name === 'rat-sass') {
                instance = inputOptions.plugins[key];
            }
        }
        if (instance) {
            includes = includes.concat(instance._getIncludes());
            let parentConfig = instance._getConfig();
            if (parentConfig) {
                for (let key in parentConfig) {
                    if (!(key in config)) {
                        config[key] = parentConfig[key];
                    }
                }
            }
        }
    };
    const generateBundle = function (options, bundle, isWrite) {
        if (instance === null) {
            this.error('The RatSassOutput plugin cannot be used without the RatSass plugin.');
            return;
        }
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
            if (file.source === '@bundle' && instance !== null) {
                file.source = instance._getBundle();
            }
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
                outFile: basename(file.fileName)
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
                                url = name.replace(':css', '');
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
                    var banner = config.banner(file.name.replace(':css', ''));
                }
                else {
                    var banner = config.banner;
                }
                banner = banner.replace(/\[name\]/g, file.name.replace(':css', ''))
                    .replace(/\[extname\]/g, (config.outputStyle === 'compressed' ? '.min' : '') + '.css')
                    .replace(/\[ext\]/g, 'css');
                data.css = banner + "\n" + data.css;
            }
            if (typeof config.footer !== 'undefined') {
                if (typeof config.footer === 'function') {
                    var footer = config.footer(file.name.replace(':css', ''));
                }
                else {
                    var footer = config.footer;
                }
                footer = footer.replace(/\[name\]/g, file.name.replace(':css', ''))
                    .replace(/\[extname\]/g, (config.outputStyle === 'compressed' ? '.min' : '') + '.css')
                    .replace(/\[ext\]/g, 'css');
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
        renderStart,
        generateBundle,
        _setInstance
    };
}

function RatSass(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const chunks = { length: 0, reference: undefined };
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());
    const _getBundle = function () {
        let result = '';
        for (let i = 0; i < chunks.length; i++) {
            result += chunks[i];
        }
        return result;
    };
    const _getConfig = function () {
        return config;
    };
    const _getIncludes = function () {
        return includes;
    };
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
                name: emitname.join('.'),
                source: code
            };
        }
        else {
            let emitname = basename(id).split('.');
            emitname[emitname.length - 1] = 'css:css';
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
                emitdata.source = '@bundle';
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
        if (typeof options.plugins !== 'undefined') {
            for (let plugin in options.plugins) {
                if (options.plugins[plugin].name === 'rat-sass-output') {
                    skipOutput = true;
                    break;
                }
            }
        }
        if (!skipOutput) {
            let output = RatSassOutput(config);
            output._setInstance({ _getBundle }, includes);
            output.generateBundle.call(this, options, bundle, isWrite);
        }
    };
    return {
        name: "rat-sass",
        transform,
        generateBundle,
        _getBundle,
        _getConfig,
        _getIncludes
    };
}

function RatSassSkip(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    return {
        name: 'rat-sass-skip',
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
