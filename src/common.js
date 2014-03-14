/*global require, module*/
/*jslint node: true */
"use strict";
var lodash = require("lodash"),
    screenSize = require("./settings.js").screenSize,
    bunnySize = require("./settings.js").bunnySize,
    externalFuncs = {
        moveTarget: function (target, newPostion) {
            var newCssStyle = lodash.clone(newPostion);
            if (newPostion.left <= 0) {
                newCssStyle.left = 0;
            } else if (newPostion.left >= screenSize.width - bunnySize.width) {
                newCssStyle.left = screenSize.width - bunnySize.width;
            }

            if (newPostion.top <= 0) {
                newCssStyle.top = 0;
            } else if (newPostion.top >= screenSize.height - bunnySize.height) {
                newCssStyle.top = screenSize.height - bunnySize.height;
            }

            newCssStyle = lodash.mapValues(newCssStyle, function (value) {
                return value + "px";
            });
            target.css(newCssStyle);
        },

        rotateTarget: function (target, degree) {
           // For webkit browsers: e.g. Chrome
            target.css({'WebkitTransform': 'rotate(' + degree + 'deg)'});
           // For Mozilla browser: e.g. Firefox
            target.css({'-moz-transform': 'rotate(' + degree + 'deg)'});
        }
    };

module.exports = externalFuncs;
