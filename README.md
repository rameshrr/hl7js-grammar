# hl7js-grammar
HL7 Grammar Parser(hl7js compatible) for Node.js

# Installation
install via [NPM](https://www.npmjs.com/):
> npm install hl7js-grammar

# Usage
## Initializing:
```javascript

var parser = require('hl7js-grammar');

```

## reader.read(buffer, callback)
```javascript

/// Basic Parsing
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

/// Prints the following
/// ip:  MSH PID [{OBR {OBX}}]
/// [{"id":"MSH","required":true},{"id":"PID","required":true},{"id":"OBR","required":false,"isArray":true,"isGroup":true,"grammar":[{"id":"OBX","required":true,"isArray":true}]}]

```

## Output format
Output is compatible to be used with hl7js

```javascript

/// Format
var grammar = [
{
    id: 'Segment_ID',
    required: true,
    isGroup: true,
    isArray: true,

    grammar: [
    ]
];

/// Example
var oruGrammar = [
    {
        id: 'MSH',
        required: true
    },
    {
        id: 'PID',
        required: true
    },
    {
        id: 'OBR',
        required: true,
        isGroup: true,
        isArray: true,

        grammar: [
            {
                id: 'OBX',
                required: true,
                isArray: true
            }
        ]
    }
];

```

# Contributions
Contributions are welcome
    
# Issues 
Please file your issues [here](https://github.com/rameshrr/hl7js-grammar/issues):
    