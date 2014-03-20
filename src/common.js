/*global require, module*/
/*jslint node: true */
"use strict";
var lodash = require("lodash"),
    $ = require("jquery"),
    settings = require("./settings.js"),
    maxNumber = 10000,
    externalFuncs = {
        moveTarget: function (target, newPostion) {
            var newCssStyle = lodash.clone(newPostion);
            if (newPostion.left <= 0) {
                newCssStyle.left = 0;
            } else if (newPostion.left >= settings.screenSize.width - settings.bunnySize.width) {
                newCssStyle.left = settings.screenSize.width - settings.bunnySize.width;
            }

            if (newPostion.top <= 0) {
                newCssStyle.top = 0;
            } else if (newPostion.top >= settings.screenSize.height - settings.bunnySize.height) {
                newCssStyle.top = settings.screenSize.height - settings.bunnySize.height;
            }

            newCssStyle = lodash.mapValues(newCssStyle, function (value) {
                return value + "px";
            });
            target.css(newCssStyle);
        },

        /*The input of degrees it accepts should be represented in angle given in 180 degree*/
        rotateTarget: function (target, degrees) {
            target.css({
            // For webkit browsers: e.g. Chrome
                '-webkit-transform' : 'rotate('  +  degrees  +  'deg)',
            // For Mozilla browser: e.g. Firefox
                '-moz-transform' : 'rotate(' + degrees + 'deg)',
                '-ms-transform' : 'rotate(' + degrees + 'deg)',
                '-o-transform' : 'rotate(' + degrees + 'deg)',
                'transform' : 'rotate(' + degrees + 'deg)',
                'zoom' : 1
            });
        },

        reachBounds: function (position, properties) {
            //here the degree is supposed to be radians, not degree
            var leftOfArrowHead,
                topOfArrowHead;
            if (properties.degree <= Math.PI / 2 && properties.degree > 0) {
                leftOfArrowHead = position.left + Math.cos(properties.degree) * (settings.arrowSize.width + properties.speed) + Math.sin(properties.degree) * settings.arrowSize.height;
                topOfArrowHead = position.top + Math.sin(properties.degree) * settings.arrowSize.width + Math.cos(properties.degree) * settings.arrowSize.height;
            } else if (properties.degree <= 0 && properties.degree > -Math.PI / 2) {
                leftOfArrowHead = position.left + Math.cos(properties.degree) * (settings.arrowSize.width + properties.speed) + Math.sin(properties.degree) * settings.arrowSize.height;
                topOfArrowHead = position.top + Math.sin(properties.degree) * properties.speed;
            } else if (properties.degree <= -Math.PI / 2) {
                leftOfArrowHead = position.left;
                topOfArrowHead = position.top + Math.sin(properties.degree) * properties.speed;
            } else if (properties.degree > Math.PI / 2) {
                leftOfArrowHead = position.left;
                topOfArrowHead = position.top + Math.sin(properties.degree) * settings.arrowSize.width + Math.cos(properties.degree) * settings.arrowSize.height;
            }

            if (leftOfArrowHead <= 0 || leftOfArrowHead >= settings.screenSize.width || topOfArrowHead <= 0 || topOfArrowHead >= settings.screenSize.height) {
                return true;
            }
            return false;
        },

        moveArrow: function (target, position, properties) {
            var moveX = Math.cos(properties.degree) * properties.speed,
                moveY = Math.sin(properties.degree) * properties.speed,
                newCssStyle = {
                    left: parseInt(position.left, 10),
                    top: parseInt(position.top, 10)
                };

            if (this.reachBounds(newCssStyle, properties)) {
                target.remove();
                return;
            }

            newCssStyle = lodash.mapValues(newCssStyle, function (value, key) {
                if ("left" === key) {
                    return value + moveX + "px";
                }

                if ("top" === key) {
                    return value + moveY + "px";
                }
            });
            target.css(newCssStyle);
            this.rotateTarget(target, properties.degree * 180 / Math.PI);
            setTimeout(function () {
                externalFuncs.moveArrow(target, newCssStyle, properties);
            }, settings.arrowMoveInterval);
        },


        generanteNewNumber: function (number) {
            if (number >= maxNumber) {
                number = 0;
            }

            return number + 1;
        },

        generateNewTarget: function (targetName, number) {
            var screen = $("#screen"),
                uniqueId = externalFuncs.generanteNewNumber(number).toString(),
                newTarget = $("<div></div>").attr("id", targetName + "-" + uniqueId);
            screen.append(newTarget);
            return newTarget;
        }
    };

module.exports = externalFuncs;
