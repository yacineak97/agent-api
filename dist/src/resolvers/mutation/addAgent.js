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
exports.addAgent = void 0;
const postgresql_1 = require("@database/postgresql");
const agent_1 = require("@resolvers/queries/agent");
const bcrypt = require('bcrypt');
const addAgent = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountID, agent } = args;
    const { username, firstname, lastname, email, avatar, phone, brief, password, roleID } = agent;
    const saltRounds = yield bcrypt.genSalt(10);
    const passwordEncrypted = yield bcrypt.hash(password, saltRounds);
    const addResult = yield postgresql_1.postgresPool.query(`
    INSERT INTO agents(username, first_name, last_name, email, 
      avatar, phone, brief, password, role, account_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
    `, [
        username,
        firstname,
        lastname,
        email,
        avatar,
        phone,
        brief || "N/A",
        passwordEncrypted,
        roleID,
        accountID,
    ]);
    const agentID = addResult.rows[0].id;
    return (yield agent_1.agent(null, { agentID, accountID }));
});
exports.addAgent = addAgent;
//# sourceMappingURL=addAgent.js.map