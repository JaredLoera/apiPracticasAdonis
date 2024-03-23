"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/services/ws"));
ws_1.default.boot();
ws_1.default.io.on('connection', (socket) => {
    socket.emit('news', { hello: 'uhsuhzicshihi' });
});
//# sourceMappingURL=socket.js.map