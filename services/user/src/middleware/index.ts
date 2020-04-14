import {
    handleBodyRequestParsing, handleCompression, handleCookieParsing, handleCors, handleCsurf, handleCsurfPrevention, handleLogStreaming
} from "./common";

export default [handleCors, handleBodyRequestParsing, handleCompression, handleCookieParsing, handleLogStreaming,
    handleCsurf, handleCsurfPrevention];
