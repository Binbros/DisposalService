import {
    handleBodyRequestParsing, handleCompression, handleCookieParsing, handleCors, handleCsurf, handleCsurfPrevention,
} from "./common";

export default [handleCors, handleBodyRequestParsing, handleCompression, handleCookieParsing,
    handleCsurf, handleCsurfPrevention];
