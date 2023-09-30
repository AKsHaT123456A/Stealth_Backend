let generator = require('generate-password');

const password = async () => {
    return generator.generate({
        length: 10,
        numbers: true
    });
}

module.exports = password;