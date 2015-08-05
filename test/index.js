/**
 * Author  : Ramesh R
 * Created : 8/5/2015 7:28 AM
 * ----------------------------------------------------------------------
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * ----------------------------------------------------------------------
 */

'use strict';

var parser = require('../index');

/// Ref: http://www.interfaceware.com/blog/hl7-segment-grammar-notation/
var grSimple = 'MSH PID NK1 PV1';
var grOptional = 'MSH PID NK1 PV1 [PV2]';
var grMultiple = 'MSH PID {NK1} PV1 [PV2]';
var grOptionalMultiple = 'MSH PID [{NK1}] PV1 [PV2]';
var grGroup = 'MSH PID [{OBR {OBX}}]';

var expression = grGroup;
parser.parse(expression, function (err, grammar) {
    console.log(err);

    console.log('ip: ', expression);
    console.log(JSON.stringify(grammar));
});