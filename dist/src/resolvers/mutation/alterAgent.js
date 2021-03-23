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
exports.alterAgent = void 0;
const postgresql_1 = require("@database/postgresql");
const alterAgent = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountID, agent } = args;
    const { id, username, firstname, lastname, email, avatar, phone, brief, password, roleID } = agent;
    const updateResult = yield postgresql_1.postgresPool.query(`
    /* Update the agent */
    UPDATE agents SET username=$1, first_name=$2, 
    last_name=$3, email=$4, avatar=$5, phone=$6, brief=$7, password=$8, role=$9
    WHERE (account_id=$10 AND id=$11) ;   
    `, [username, firstname, lastname, email, avatar, phone, brief, password, roleID, accountID, id]);
    if (updateResult.rowCount > 0) {
        return { completed: true };
    }
    else {
        return { completed: false, faildItems: [agent.id] };
    }
});
exports.alterAgent = alterAgent;
//# sourceMappingURL=alterAgent.js.map