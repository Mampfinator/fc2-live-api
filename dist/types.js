"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamChatType = exports.Watchability = exports.APIStreamChatType = exports.APIWatchability = void 0;
var APIWatchability;
(function (APIWatchability) {
    APIWatchability[APIWatchability["Unlimited"] = 0] = "Unlimited";
    APIWatchability[APIWatchability["LoginRequired"] = 1] = "LoginRequired";
    APIWatchability[APIWatchability["PointsRequired"] = 2] = "PointsRequired";
})(APIWatchability = exports.APIWatchability || (exports.APIWatchability = {}));
var APIStreamChatType;
(function (APIStreamChatType) {
    APIStreamChatType[APIStreamChatType["Open"] = 0] = "Open";
    APIStreamChatType[APIStreamChatType["MultiPerson"] = 1] = "MultiPerson";
    APIStreamChatType[APIStreamChatType["OneToOne"] = 2] = "OneToOne";
})(APIStreamChatType = exports.APIStreamChatType || (exports.APIStreamChatType = {}));
var Watchability;
(function (Watchability) {
    Watchability["NoLoginRequired"] = "Unlimited";
    Watchability["LoginRequired"] = "LoginRequired";
    Watchability["PointsRequired"] = "PointsRequired";
})(Watchability = exports.Watchability || (exports.Watchability = {}));
var StreamChatType;
(function (StreamChatType) {
    StreamChatType["Open"] = "Open";
    StreamChatType["MultiPerson"] = "MultiPerson";
    StreamChatType["OneOnOne"] = "OneOnOne";
})(StreamChatType = exports.StreamChatType || (exports.StreamChatType = {}));
