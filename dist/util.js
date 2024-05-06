"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STREAM_CHAT_TYPE_LOOKUP = exports.WATCHABILITY_LOOKUP = exports.toNumber = exports.makePath = exports.BASE_URL = void 0;
const path_1 = require("path");
const types_1 = require("./types");
exports.BASE_URL = "https://live.fc2.com/";
function makePath(...paths) {
    const path = (0, path_1.join)(...paths);
    return exports.BASE_URL + path;
}
exports.makePath = makePath;
/**
 * Like Number(n), but treats undefined as 0.
 */
function toNumber(boolean) {
    if (typeof boolean === "undefined")
        return 0;
    return Number(boolean);
}
exports.toNumber = toNumber;
exports.WATCHABILITY_LOOKUP = {
    [types_1.APIWatchability.Unlimited]: types_1.Watchability.NoLoginRequired,
    [types_1.APIWatchability.LoginRequired]: types_1.Watchability.LoginRequired,
    [types_1.APIWatchability.PointsRequired]: types_1.Watchability.PointsRequired,
};
// currently unused
exports.STREAM_CHAT_TYPE_LOOKUP = {
    [types_1.APIStreamChatType.Open]: types_1.StreamChatType.Open,
    [types_1.APIStreamChatType.MultiPerson]: types_1.StreamChatType.MultiPerson,
    [types_1.APIStreamChatType.OneToOne]: types_1.StreamChatType.OneOnOne,
};
