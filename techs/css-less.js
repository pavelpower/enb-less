/**
 * css-less
 * ==========
 *
 * Собирает *css*-файлы вместе со *less*-файлами по deps'ам, обрабатывает инклуды и ссылки, сохраняет в виде `?.css`.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию `?.css`.
 * * *Object* **variables** — Дополнительные переменные окружения для `less`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *Boolean* **relativeUrl** — создавать относительные пути (по умлочанию `true` - содавать)
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-less/techs/css-less'));
 * ```
 */
var vow = require('vow');
var less = require('less');
var urlRegexp = /url\(['"]{0,1}([^'"\)]*)['"]{0,1}\)/gm;

module.exports = require('enb/techs/css').buildFlow()
    .name('css-less')
    .target('target', '?.css')
    .defineOption('compress', false)
    .defineOption('relativeUrl', true)
    .defineOption('prefix', '')
    .defineOption('variables')
    .useFileList(['css', 'less'])
    .builder(function (sourceFiles) {
        var _this = this;
        var defer = vow.defer();
        var options = {};
        var variables = this._variables;
        var relativeUrl = this.relativeUrl;

        var css = sourceFiles.map(function (file) {
            var path = _this.node.relativePath(file.fullname);
            if (file.name.indexOf('.less') !== -1) {

                var body = require('fs').readFileSync(_this.node.resolvePath(path)).toString();

                if (relativeUrl) {
                    var urls = body.match(urlRegexp);
                    if (urls !== undefined) {
                        body = body.replace(/url\(['"]{0,1}([^'"\)]*)['"]{0,1}\)/gm, 'url("' +
                        require('path').dirname(path) +
                        '/$1")');
                    }
                }

                // get body of less files, but relative @import is not normal work
                return [
                    '/* ' + path + ':begin */\n',
                    body,
                    '/* ' + path + ':end */\n'
                ].join('');

            } else {
                return '@import "' + path + '";';
            }
        }).join('\n');

        if (variables) {
            Object.keys(variables).forEach(function (key) {
                options[key] = variables[key];
            }.bind(this));
        }

        less.render(css, options, function (err, css) {
            if (err) {
                // т.к. enb при сборке не показывает ошибок из reject
                // придется отсавить тут console.log до update enb с фиксом этого бага
                console.log(err);
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
