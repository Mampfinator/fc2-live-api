"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FC2Client = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ChannelManager_1 = require("./ChannelManager");
class FC2Client extends eventemitter3_1.default {
    constructor(options) {
        super();
        this.channels = new ChannelManager_1.ChannelManager(this);
        this.token = options === null || options === void 0 ? void 0 : options.token;
        if (!(options === null || options === void 0 ? void 0 : options.noEvents)) {
            this.start();
        }
    }
    /**
     * Starts event generator.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channels.start();
        });
    }
}
exports.FC2Client = FC2Client;
