import {
    handleBodyRequestParsing, handleCompression, handleCookieParsing, handleCors,
    handleLogStreaming,
} from "./common";

export default [handleCors, handleBodyRequestParsing,  handleCookieParsing, handleCompression, handleLogStreaming,
];
