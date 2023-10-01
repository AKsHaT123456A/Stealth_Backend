let generator = require('generate-password');

const pass = generator.generate({
    length: 10,
    numbers: true
});


module.exports = pass;