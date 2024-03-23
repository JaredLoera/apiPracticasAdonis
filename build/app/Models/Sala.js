"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Message_1 = __importDefault(require("./Message"));
const User_1 = __importDefault(require("./User"));
class Sala extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Sala.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Sala.prototype, "nombre", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Sala.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Sala.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Sala.prototype, "pelicula_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Sala.prototype, "pausada", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Sala.prototype, "messages_id", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Sala.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Sala.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.hasMany)(() => Message_1.default, {
        foreignKey: 'sala_id',
        localKey: 'id'
    }),
    __metadata("design:type", Object)
], Sala.prototype, "messages", void 0);
__decorate([
    (0, Orm_1.hasOne)(() => User_1.default, {
        localKey: 'user_id',
        foreignKey: 'id'
    }),
    __metadata("design:type", Object)
], Sala.prototype, "user", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => User_1.default, {
        pivotTable: 'sala_user',
        localKey: 'id',
        pivotForeignKey: 'sala_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], Sala.prototype, "users", void 0);
exports.default = Sala;
//# sourceMappingURL=Sala.js.map