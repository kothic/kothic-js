#!/usr/bin/python

import sys
import os

from mapcss_parser import MapCSSParser

from mapcss_parser import ast

if len(sys.argv) != 2:
    print "usage : mapcss.py inputfile"
    raise SystemExit

content = open(sys.argv[1]).read()
parser = MapCSSParser(debug=False)
mapcss = parser.parse(content)

CHECK_OPERATORS = {
    '=': '==',
    '<': '<',
    '<=': '<=',
    '>': '>',
    '>=': '>=',
    '!=': '!==',
    '<>': '!==',
}

DASH_PROPERTIES = ('dashes', 'casing-dashes')
NUMERIC_PROPERTIES = (
    'z-index', 
    'width', 
    'opacity', 
    'fill-opacity', 
    'casing-width', 
    'casing-opacity', 
    'text-offset', 
    'max-width', 
    'text-halo-radius'
)

icon_images = set()

def propagate_import(url):
    content = open(url).read()
    return parser.parse(content)

def escape_value(key, value, subpart):
    if isinstance(value, ast.Eval):
        return value.as_js(subpart)
    elif key in NUMERIC_PROPERTIES:
        return value
    elif key in DASH_PROPERTIES:
        return "[%s]" % value
    else:
        return "'%s'" % value

def mapcss_as_aj(self):
    imports = "".join(map(lambda imp: propagate_import(imp.url).as_js, self.imports))
    rules = "\n".join(map(lambda x: x.as_js(), self.rules))
    return "%s%s" % (imports, rules)
    
def mapcss_canvas_as_aj(self):
    actions = []
    for rule in self.rules:
        for selector in filter(lambda selector: selector.subject == 'canvas', rule.selectors):
            for action in rule.actions:
                for stmt in action.statements:
                    actions.append("style['%s'] = %s;" % (stmt.key, escape_value(stmt.key, stmt.value, 'default') ))
    return """
    if (c.selector == "canvas") {
        %s
    }
    """ % "\n    ".join(actions)
    
def rule_as_js(self):
    rules = []
    for selector in self.selectors:
        for action in map(lambda action: "    if (%s%s) %s" % (selector.as_js(), selector.get_zoom(), action.as_js(selector.subpart)), self.actions):
            rules.append(action)

    return "\n".join(rules)
    
def selector_as_js(self):
    criteria = " && ".join(map(lambda x: x.as_js(), self.criteria))
    
    if self.subject in ['node', 'way', 'relation', 'coastline']:
        subject_property = 'type'
    else:
        subject_property = 'selector'
        
    if self.criteria:
        return "(%s == '%s' && %s)" % (subject_property, self.subject, criteria)
    else:
        return "%s == '%s'" % (subject_property, self.subject)
    
def condition_check_as_js(self):
    if self.value == 'yes' and self.sign == '=':
        return "(tags['%s'] == '1' || tags['%s'] == 'true' || tags['%s'] == 'yes')" % (self.key, self.key, self.key)
    elif self.value == 'yes' and (self.sign == '!=' or self.sign == '<>'):
        return "(tags['%s'] == '-1' || tags['%s'] == 'false' || tags['%s'] == 'no')" % (self.key, self.key, self.key)
    else:
        return "tags['%s'] %s '%s'" % (self.key, CHECK_OPERATORS[self.sign], self.value)

def condition_tag_as_js(self):
    return "(typeof tags['%s'] !== 'undefined' && tags['%s'] !== null)" % (self.key, self.key)

def condition_nottag_as_js(self):
    return "(typeof tags['%s'] === 'undefined' || tags['%s'] === null)" % (self.key, self.key)
    
def action_as_js(self, subpart):
    if len(filter(lambda x: x, map(lambda x: isinstance(x, ast.StyleStatement), self.statements))) > 0:
        prep = ''
        if subpart != "default":
            prep = """
        if (typeof(style['%s']) === 'undefined') {
            style['%s'] = {};
        }
""" % (subpart, subpart)
        return """{
%s%s
    }\n""" % (prep, "\n".join(map(lambda x: x.as_js(subpart), self.statements)))
    else:
        return "{\n    %s\n    }" % "\n".join(map(lambda x: x.as_js(), self.statements))
    
def style_statement_as_js(self, subpart):
    val = escape_value(self.key, self.value, subpart)
    if self.key == 'text':
        return "        style['%s']['text'] = tags[%s];" % (subpart, val)
    else:
        if self.key == 'icon-image':
            icon_images.add(val)
        return "        style['%s']['%s'] = %s;" % (subpart, self.key, val)
    

def tag_statement_as_js(self, subpart):
    return "        tags['%s'] = %s" % (self.key, escape_value(self.key, self.value, subpart))
    
def eval_as_js(self, subpart):
    return self.expression.as_js(subpart)
    
def eval_function_as_js(self, subpart):
    args = ", ".join(map(lambda arg: arg.as_js(subpart), self.arguments))
    if self.function == 'tag':
        return "MapCSS.tag(tags, %s)" % (args)
    elif self.function == 'prop':
        return "MapCSS.prop(style['%s'], %s)" % (subpart, args)
    else:
        return "MapCSS.%s(%s)" % (self.function, args)

def eval_string_as_js(self, subpart):
    return str(self)
    
def eval_op_as_js(self, subpart):
    op = self.operation
    if op == '.':
        op = '+'

    if op == 'eq':
        op = '=='

    if op == 'ne':
        op = '!='
        
    return "%s %s %s" % (self.arg1.as_js(subpart), self.operation, self.arg2.as_js(subpart))
    
def eval_group_as_js(self, subpart):
    return "(%s)" % str(self.expression.as_js(subpart))
    
def selector_get_zoom(self):
    zoom = self.zoom
    zoom = zoom.strip("|")
    if zoom and zoom[0] == 'z':
        zoom = zoom[1:].split('-')
        if len(zoom) == 1 and int(zoom[0]) < 18:
            zoom.append(int(zoom[0]) + 1)
        elif len(zoom) == 1:
            zoom.append(int(zoom[0]))

        cond = ''
        if zoom[0]:
            cond += ' && zoom >= %d' % int(zoom[0])
        if zoom[1]:
            cond += ' && zoom <= %d' % int(zoom[1])
        return cond
        
    return ''

ast.MapCSS.as_js = mapcss_as_aj
ast.MapCSS.canvas_as_js = mapcss_canvas_as_aj
ast.Rule.as_js = rule_as_js
ast.Selector.as_js = selector_as_js
ast.Selector.get_zoom = selector_get_zoom
ast.ConditionCheck.as_js = condition_check_as_js
ast.ConditionTag.as_js = condition_tag_as_js
ast.ConditionNotTag.as_js = condition_nottag_as_js
ast.Action.as_js = action_as_js
ast.StyleStatement.as_js = style_statement_as_js
ast.TagStatement.as_js = tag_statement_as_js
ast.Eval.as_js = eval_as_js

ast.EvalExpressionString.as_js = eval_string_as_js
ast.EvalExpressionOperation.as_js = eval_op_as_js
ast.EvalExpressionGroup.as_js = eval_group_as_js
ast.EvalFunction.as_js = eval_function_as_js


print """
MapCSS = function() {
    return this;
}

MapCSS.min = function(/*...*/) {
    return Math.min.apply(null, arguments);
}

MapCSS.max = function(/*...*/) {
    return Math.max.apply(null, arguments);
}

MapCSS.any = function(/*...*/) {
    for(var i = 0; i < arguments.length; i++) {
        if (typeof(arguments[i]) != 'undefined' && arguments[i] != '') {
            return arguments[i];
        }
    }
    
    return "";
}

MapCSS.num = function(arg) {
    if (!isNaN(parseFloat(arg))) {
        return parseFloat(arg);
    } else {
        return ""
    }
}

MapCSS.str = function(arg) {
    return arg;
}

MapCSS.int = function(arg) {
    return parseInt(arg);
}

MapCSS.tag = function(a, tag) {
    if (typeof(a[tag]) != 'undefined') {
        return a[tag];
    } else {
        return "";
    }
}

MapCSS.prop = function(obj, tag) {
    if (typeof(obj[tag]) != 'undefined') {
        return obj[tag];
    } else {
        return "";
    }
}

MapCSS.sqrt = function(arg) {
    return math.sqrt(arg);
}

MapCSS.boolean = function(arg) {
    if (arg == '0' || arg == 'false' || arg == '') {
        return 'false';
    } else {
        return 'true';
    }
}

MapCSS.boolean = function(exp, if_exp, else_exp) {
    if (MapCSS.boolean(exp) == 'true') {
        return if_exp;
    } else {
        return else_exp;
    }
}

MapCSS.metric = function(arg) {
    if (/\d\s*mm$/.test(arg)) {
        return 1000 * parseInt(arg);
    } else if (/\d\s*cm$/.test(arg)) {
        return 100 * parseInt(arg);
    } else if (/\d\s*dm$/.test(arg)) {
        return 10 * parseInt(arg);
    } else if (/\d\s*km$/.test(arg)) {
        return 0.001 * parseInt(arg);
    } else if (/\d\s*in$/.test(arg)) {
        return 0.0254 * parseInt(arg);
    } else if (/\d\s*ft$/.test(arg)) {
        return 0,3048 * parseInt(arg);
    } else {
        return parseInt(arg);
    }
}

MapCSS.zmetric = function(arg) {
    return MapCSS.metric(arg)
}

function restyle(tags, zoom, type, selector) {
    var style=new Object;
    style["default"]=new Object;
"""
print mapcss.as_js()
print """
    return style;
}

imagesToLoad = [%s];
""" % ", ".join(icon_images)
