import { ZodError } from "zod";
export type FC2Error = FC2ApiError | FC2ClientError;
/**
 * Error returned from the API.
 */
export declare class FC2ApiError extends Error {
    readonly code: number;
    readonly reason: string;
    readonly endpoint: string;
    constructor(code: number, reason: string, endpoint: string);
}
/**
 * Error that originates from within the client.
 */
export declare class FC2ClientError<TError = any> extends Error {
    readonly endpoint?: string;
    readonly reason: string;
    readonly details: TError;
    constructor(reason: string, details: TError, endpoint?: string);
}
/**
 * Triggered when the API returns an unexpected type. Please [create an Issue](https://github.com/Mampfinator/fc2-live-api/issues/new) should this ever happen.
 */
export type FC2APITypeError = FC2ClientError<ZodError>;
