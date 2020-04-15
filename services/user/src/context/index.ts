import { ContextParameters } from "graphql-yoga/dist/types";
import models from "../models";

export default function({request, response}: ContextParameters) {
    return {
        models,
        request,
        response,
    };
}