/**
 * Author  : Ramesh R
 * Created : 8/5/2015 7:27 AM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

'use strict';

var delimiters = {
    optionalChar: '[',
    repeatChar: '{',
    '[': ']',
    '{': '}'
};

module.exports = {

    specialChars: [delimiters.optionalChar, delimiters.repeatChar],

    parse: function (expression, callback) {

        if (!expression) {
            return callback({err: 'Invalid Grammar'});
        }

        var grammar = this.parseExpression(expression, 0);
        callback(null, grammar);
    },

    parseExpression: function (expression, currentIndex) {
        /// Split Tokens
        var currentIndex = 0;
        var tokens = [];

        while (currentIndex < expression.length) {
            if (this.specialChars.indexOf(expression[currentIndex]) > -1) {

                var isArray = expression[currentIndex] == delimiters.repeatChar;
                var isOptional = expression[currentIndex] == delimiters.optionalChar;

                var nestedGrammar = this.getInnerExpression(expression, currentIndex, expression[currentIndex], delimiters[expression[currentIndex]]);
                var innerExpression = nestedGrammar.innerExpression;

                currentIndex = nestedGrammar.currentIndex;

                /// Trim the repeat char if available at the beginning
                if (isOptional && innerExpression[0] == delimiters.repeatChar) {
                    isArray = true;
                    innerExpression = innerExpression.substring(1, innerExpression.length - 1);
                }

                if (innerExpression.length == 3) {
                    tokens.push({
                        id: innerExpression,
                        required: !isOptional,
                        isArray: isArray
                    });
                } else {
                    var innerTokens = this.parseExpression(innerExpression);
                    var firstToken = innerTokens.shift();

                    tokens.push({
                        id: firstToken.id,
                        required: !isOptional,
                        isArray: isArray,
                        isGroup: true,

                        grammar: innerTokens
                    });
                }
            } else if (expression[currentIndex] == ' ') {
                currentIndex++;
            } else {
                var grammarInfo = this.getSegmentId(expression, currentIndex);
                var segmentId = grammarInfo.segmentId;
                currentIndex = grammarInfo.currentIndex;

                tokens.push({
                    id: segmentId,
                    required: true
                });
            }
        }

        return tokens;
    },

    getSegmentId: function (expression, currentIndex) {
        var segmentId = '';
        while (currentIndex < expression.length && expression[currentIndex] != ' ') {
            segmentId += expression[currentIndex];
            currentIndex++;
        }

        return {segmentId: segmentId, currentIndex: currentIndex};
    },

    getInnerExpression: function (expression, currentIndex, openSymbol, closeSymbol) {
        var nestedTokens = 0;
        var innerExpression = '';

        /// Skip initial character
        currentIndex++;

        while (currentIndex < expression.length) {

            if (nestedTokens == 0 && expression[currentIndex] == closeSymbol) {
                break;
            }

            if (expression[currentIndex] == openSymbol) {
                nestedTokens++;
            }

            if (expression[currentIndex] == closeSymbol) {
                nestedTokens--;
            }


            innerExpression += expression[currentIndex];
            currentIndex++;
        }

        currentIndex++;
        return {innerExpression: innerExpression, currentIndex: currentIndex};
    }
};