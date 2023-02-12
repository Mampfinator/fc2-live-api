import { ZodError } from "zod";

export type FC2Error = FC2ApiError | FC2ClientError;

/**
 * Error returned from the API.
 */
export class FC2ApiError extends Error {
    constructor(
        public readonly code: number,
        public readonly reason: string,
        public readonly endpoint: string
    ) {
        super(`[${code}]: ${reason ?? "No reason provided."}`);
    }
}

/**
 * Error that originates from within the client.
 */
export class FC2ClientError<TError = any> extends Error {
    constructor(
        public readonly reason: string,
        public readonly details: TError
    ) {
        super(reason);
    }
}

/**
 * Triggered when the API returns an unexpected type. Please [create an Issue](https://github.com/Mampfinator/fc2-live-api/issues/new) should this ever happen.
 */
export type FC2APITypeError = FC2ClientError<ZodError>;
