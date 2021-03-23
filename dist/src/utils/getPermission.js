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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermission = void 0;
const getPermission = (permissionID, postgresPool) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresPool.query(`SELECT * FROM permissions WHERE (id=$1)`, [
        permissionID
    ]);
    return result;
});
exports.getPermission = getPermission;
//# sourceMappingURL=getPermission.js.map