e_min: function (/*...*/) {
    return Math.min.apply(null, arguments);
},

e_max: function (/*...*/) {
    return Math.max.apply(null, arguments);
},

e_any: function (/*...*/) {
    var i;

    for (i = 0; i < arguments.length; i++) {
        if (typeof(arguments[i]) !== 'undefined' && arguments[i] !== '') {
            return arguments[i];
        }
    }

    return '';
},

e_num: function (arg) {
    if (!isNaN(parseFloat(arg))) {
        return parseFloat(arg);
    } else {
        return '';
    }
},

e_str: function (arg) {
    return arg;
},

e_int: function (arg) {
    return parseInt(arg, 10);
},

e_tag: function (obj, tag) {
    if (obj.hasOwnProperty(tag) && obj[tag] !== null) {
        return tag;
    } else {
        return '';
    }
},

e_prop: function (obj, tag) {
    if (obj.hasOwnProperty(tag) && obj[tag] !== null) {
        return obj[tag];
    } else {
        return '';
    }
},

e_sqrt: function (arg) {
    return Math.sqrt(arg);
},

e_boolean: function (arg, if_exp, else_exp) {
    if (typeof(if_exp) === 'undefined') {
        if_exp = 'true';
    }

    if (typeof(else_exp) === 'undefined') {
        else_exp = 'false';
    }

    if (arg === '0' || arg === 'false' || arg === '') {
        return else_exp;
    } else {
        return if_exp;
    }
},

e_metric: function (arg) {
    if (/\d\s*mm$/.test(arg)) {
        return 1000 * parseInt(arg, 10);
    } else if (/\d\s*cm$/.test(arg)) {
        return 100 * parseInt(arg, 10);
    } else if (/\d\s*dm$/.test(arg)) {
        return 10 * parseInt(arg, 10);
    } else if (/\d\s*km$/.test(arg)) {
        return 0.001 * parseInt(arg, 10);
    } else if (/\d\s*in$/.test(arg)) {
        return 0.0254 * parseInt(arg, 10);
    } else if (/\d\s*ft$/.test(arg)) {
        return 0.3048 * parseInt(arg, 10);
    } else {
        return parseInt(arg, 10);
    }
},

e_zmetric: function (arg) {
    return MapCSS.e_metric(arg);
},

e_localize: function (tags, text) {
    var locales = MapCSS.locales, i, tag;

    for (i = 0; i < locales.length; i++) {
        tag = text + ':' + locales[i];
        if (tags[tag]) {
            return tags[tag];
        }
    }

    return tags[text];
},

e_join: function () {
    if (arguments.length === 2 && Object.prototype.toString.call(arguments[1]) === '[object Array]') {
        return arguments[1].join(arguments[0]);
    } else {
        var tagString = "";

        for (var i = 1; i < arguments.length; i++)
            tagString = tagString.concat(arguments[0]).concat(arguments[i]);

        return tagString.substr(arguments[0].length);
    }
},

e_split: function (sep, text) {
    return text.split(sep);
},

e_get: function(arr, index) {
    if (Object.prototype.toString.call(arr) !== '[object Array]')
        return "";

    if (!/^[0-9]+$/.test(index) || index >= arr.length())
        return "";

    return arr[index];
},

e_set: function(arr, index, text) {
    if (Object.prototype.toString.call(arr) !== '[object Array]')
        return [];

    if (!/^[0-9]+$/.test(index))
        return [];

    arr[index] = text;

    return arr;
},

e_count: function(arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]')
        return 0;

    return arr.length();
},

e_list: function() {
    return arguments;
},

e_append: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]')
        return [];

    lst.push(v);

    return lst;
},

e_contains: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]')
        return false;

    return (lst.indexOf(v) >= 0);
},

e_sort: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]')
        return [];

    lst.sort();

    return lst;
},

e_reverse: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]')
        return [];

    lst.reverse();

    return lst;
},
