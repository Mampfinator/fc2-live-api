export class FC2ApiError extends Error {
    constructor(
        public readonly code: number,
        public readonly reason: string,
        public readonly endpoint: string,
    ) {
        super(`[${code}]: ${reason ?? "No reason provided."}`);
    }
}