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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var sdk = require("node-appwrite");
module.exports = function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var client, database, payloadData, eventData, docs, error_1, collections, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
                        !req.variables["APPWRITE_FUNCTION_API_KEY"]) {
                        throw Error("variables are not set. Function cannot use Appwrite SDK.");
                    }
                    client = new sdk.Client();
                    client
                        .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
                        .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
                        .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);
                    database = new sdk.Databases(client);
                    console.log("test-fun request:", req);
                    console.log("test-fun variables:", req.variables);
                    try {
                        payloadData = JSON.parse(req.payload);
                        console.log("payload data", payloadData);
                    }
                    catch (error) {
                        console.log("Error parsing JSON", error);
                    }
                    try {
                        eventData = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"]);
                        console.log("event data", eventData);
                    }
                    catch (error) {
                        console.log("Error parsing JSON", error);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("fetch docs");
                    return [4 /*yield*/, database.listDocuments(req.variables["DATABASE_ID"], "6377552b559b49cb309a")];
                case 2:
                    docs = _a.sent();
                    console.log("docs", docs);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("error fetching docs", error_1 + "");
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, database.listCollections(req.variables["DATABASE_ID"])];
                case 5:
                    collections = _a.sent();
                    console.log("collections", collections);
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.log("error fetching collections", error_2, req.variables["DATABASE_ID"]);
                    return [3 /*break*/, 7];
                case 7:
                    res.send("Finshed cloud function!");
                    return [2 /*return*/];
            }
        });
    });
};
