/**
 * css-less
 * ==========
 *
 * Собирает *css*-файлы вместе со *less*-файлами по deps'ам, обрабатывает инклуды и ссылки, сохраняет в виде `?.css`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `?.css`.
 * * *Object* **variables** — Дополнительные переменные окружения для `stylus`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-less/techs/css-less'));
 * ```
 */
var vow = require('vow');
var less = require('less');

module.exports = require('enb/techs/css').buildFlow()
    .name('css-less')
    .target('target', '?.css')
    .defineOption('compress', false)
    .defineOption('prefix', '')
    .defineOption('variables')
    .useFileList(['css', 'less'])
    .builder(function (sourceFiles) {
        var _this = this;
        //var filename = this.node.resolvePath(this._target);
        var defer = vow.defer();
        var options = {};

        var css = sourceFiles.map(function (file) {
            var path = _this.node.relativePath(file.fullname);
            if (file.name.indexOf('.less') !== -1) {
                return '/* ' + path + ':begin */\n' +
                    '@import "' + path + '";\n' +
                    '/* ' + path + ':end */\n';
            } else {
                return '@import "' + path + '";';
            }
        }).join('\n');

        if (this._variables) {
            Object.keys(this._variables).forEach(function (key) {
                options[key] = this._variables[key];
            }.bind(this));
        }

        less.render(css, options, function (err, css) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(css);
            }
        });

        return defer.promise()
            .then(function (css) {
                return _this._processIncludes(css, _this.node.resolvePath(_this.targetName));
            });
    })
    .methods({
        _configureRenderer: function (renderer) {
            return renderer;
        }
    })
    .createTech();
