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
exports.deleteAgents = void 0;
const postgresql_1 = require("@database/postgresql");
const deleteAgents = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountID, agentsID } = args;
    const faildItems = [];
    for (const id of agentsID) {
        try {
            const deleteResult = yield postgresql_1.postgresPool.query(`DELETE FROM agents WHERE (account_id=$1 AND id=$2)`, [
                accountID,
                id
            ]);
            if (deleteResult.rowCount === 0) {
                faildItems.push(id);
            }
        }
        catch (e) {
            console.error(e);
            faildItems.push(id);
            continue;
        }
    }
    return {
        completed: faildItems.length === 0,
        faildItems,
    };
});
exports.deleteAgents = deleteAgents;
//# sourceMappingURL=deleteAgents.js.map