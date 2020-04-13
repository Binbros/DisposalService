import {HTTPClientError} from "./httpClientError";

export class HTTP400Error extends HTTPClientError {
    public readonly statusCode = 400;

    constructor(message: string | object = "Bad Request") {
        super(message);
    }
}
