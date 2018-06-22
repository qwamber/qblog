module.exports.FieldError = class AuthFieldError {
    constructor(field, message) {
        this.field = field;
        this.message = message;
        this.date = new Date();
    }
};
