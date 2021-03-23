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
exports.agent = void 0;
const postgresql_1 = require("@database/postgresql");
const getAgent_1 = require("@utils/getAgent");
const getPermission_1 = require("@utils/getPermission");
const getRole_1 = require("@utils/getRole");
const agent = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentID } = args;
    const agentResult = yield getAgent_1.getAgent(agentID, postgresql_1.postgresPool);
    if (agentResult.rowCount === 1) {
        const agent = agentResult.rows[0];
        const roleResult = yield getRole_1.getRole(agent.role, postgresql_1.postgresPool);
        if (roleResult.rowCount !== 1) {
            throw new Error("Rule not found");
        }
        const role = roleResult.rows[0];
        const permissions = [];
        for (const permissionID of role.permission) {
            const permissionResult = yield getPermission_1.getPermission(permissionID, postgresql_1.postgresPool);
            if (permissionResult.rowCount !== 1) {
                throw new Error("Permission not found");
            }
            const permission = permissionResult.rows[0];
            permissions.push({
                id: permission.id,
                name: permission.title,
                description: permission.value
            });
        }
        return {
            id: agent.id,
            username: agent.username,
            firstname: agent.firstname,
            lastname: agent.lastname,
            email: agent.email,
            avatar: agent.avatar,
            phone: agent.phone,
            brief: agent.brief,
            role: {
                id: role.id,
                name: role.title,
                permissions
            }
        };
    }
    else {
        return void "Agent doesn't exist";
    }
});
exports.agent = agent;
//# sourceMappingURL=agent.js.map