'use strict';

var validateConstants = require('./validate/validate_constants');
var validate = require('./validate/validate');
var latestStyleSpec = require('../reference/latest.min');
var parseStyle = require('./parse_style');
var ParsingError = require('./parsing_error');

module.exports = function(style, styleSpec) {
    try {
        return validateStyleObject(parseStyle(style), styleSpec);
    } catch (e) {
        if (e instanceof ParsingError) return [e];
        else throw e;
    }
};

function validateStyleObject(style, styleSpec) {
    styleSpec = styleSpec || latestStyleSpec;

    var errors = [];

    errors = errors.concat(validate({
        key: '',
        value: style,
        valueSpec: styleSpec.$root,
        styleSpec: styleSpec,
        style: style
    }));

    if (styleSpec.$version > 7 && style.constants) {
        errors = errors.concat(validateConstants({
            key: 'constants',
            value: style.constants,
            style: style,
            styleSpec: styleSpec
        }));
    }

    return errors
        .filter(function(error) {
            return error !== undefined;
        })
        .sort(function (a, b) {
            return a.line - b.line;
        });
}