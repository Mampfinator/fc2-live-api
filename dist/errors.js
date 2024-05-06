"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FC2ClientError = exports.FC2ApiError = void 0;
/**
 * Error returned from the API.
 */
class FC2ApiError extends Error {
    constructor(code, reason, endpoint) {
        super(`[${code}]: ${reason !== null && reason !== void 0 ? reason : "No reason provided."}`);
        this.code = code;
        this.reason = reason;
        this.endpoint = endpoint;
    }
}
exports.FC2ApiError = FC2ApiError;
/**
 * Error that originates from within the client.
 */
class FC2ClientError extends Error {
    constructor(reason, details) {
        super(reason);
        this.reason = reason;
        this.details = details;
    }
}
exports.FC2ClientError = FC2ClientError;
