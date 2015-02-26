enb-less [![Build Status](https://travis-ci.org/pavelpower/enb-less.png?branch=master)](https://travis-ci.org/pavelpower/enb-less) [![NPM version](https://badge.fury.io/js/enb-less.png)](http://badge.fury.io/js/enb-less)
===========

Поддержка Less для ENB. Пакет содержит технологии:
 * `enb-stylus/techs/css-less`
 * `enb-stylus/techs/css-less-with-autoprefixer`

Установка:
----------

```
npm install enb-less
```

css-less
----------

Собирает *css*-файлы вместе со *less*-файлами по deps'ам, обрабатывает инклуды и ссылки, сохраняет в виде `?.css`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию `?.css`.
* *Boolean* **compress** - Минифицировать результирующий CSS. По умолчанию `false`.
* *String* **prefix** - Префикс, добавляемый классам в результирующем CSS. По умолчанию `''`.
* *Object* **variables** — Дополнительные переменные окружения для `less`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
  (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-less/techs/css-less'));
```

css-less-with-autoprefixer
----------------------------

Собирает *css*-файлы вместе со *less*-файлами по deps'ам, обрабатывает инклуды и ссылки, сохраняет в виде `?.css`.
Производит пост-обработку автопрефиксером.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию `?.css`.
* *Boolean* **compress** - Минифицировать результирующий CSS. По умолчанию `false`.
* *String* **prefix** - Префикс, добавляемый классам в результирующем CSS. По умолчанию `''`.
* *Object* **variables** — Дополнительные переменные окружения для `less`.
* *Array* **browsers** — Браузеры (опция автопрефиксера).
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
  (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
nodeConfig.addTech(require('enb-less/techs/css-less-with-autoprefixer'), {autoprefixerArguments: ['ie 7', 'ie 8']});
```
