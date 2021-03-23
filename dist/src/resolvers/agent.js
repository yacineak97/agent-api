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
exports.resolvers = void 0;
const postgresql_1 = require("../database/postgresql");
exports.resolvers = {
    Query: {
        agents: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID } = args;
            const agents = [];
            const results = yield postgresql_1.postgresPool.query(`SELECT * FROM agents WHERE account_id=$1`, [accountID]);
            const roles = new Map();
            for (const agent of results.rows) {
                try {
                    if (agent.role && !roles.has(agent.role)) {
                        const roleResult = yield postgresql_1.postgresPool.query("SELECT * FROM roles WHERE (id=$1)", [
                            agent.role,
                        ]);
                        if (roleResult.rowCount !== 1) {
                            throw new Error("Role not found");
                        }
                        const role = roleResult.rows[0];
                        const permissions = [];
                        for (const permissionId of role.permission) {
                            const permissionResult = yield postgresql_1.postgresPool.query("SELECT * FROM permissions WHERE (id=$1)", [
                                permissionId,
                            ]);
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
                        roles.set(agent.role, {
                            id: role.id,
                            name: role.title,
                            permissions,
                        });
                    }
                    const role = roles.get(agent.role);
                    agents.push({
                        id: agent.id,
                        username: agent.username,
                        firstname: agent.firstname,
                        lastname: agent.lastname,
                        email: agent.email,
                        avatar: agent.avatar,
                        phone: agent.phone,
                        brief: agent.brief,
                        role,
                    });
                }
                catch (e) {
                    console.error(`faild to fetch : ${e}`);
                }
            }
            return agents;
        }),
        agent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID, agentID } = args;
            const agentResult = yield postgresql_1.postgresPool.query(`SELECT * FROM agents WHERE (account_id=$1 AND id=$2)`, [
                accountID,
                agentID
            ]);
            if (agentResult.rowCount === 1) {
                const agent = agentResult.rows[0];
                const roleResult = yield postgresql_1.postgresPool.query("SELECT * FROM roles WHERE (id=$1)", [agent.role,]);
                if (roleResult.rowCount !== 1) {
                    throw new Error("Rule not found");
                }
                const role = roleResult.rows[0];
                const permissions = [];
                for (const permissionId of role.permission) {
                    const permissionResult = yield postgresql_1.postgresPool.query("SELECT * FROM permissions WHERE (id=$1)", [
                        permissionId,
                    ]);
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
        }),
    },
    Mutation: {
        deleteAgent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID, agentID } = args;
            const deleteResult = yield postgresql_1.postgresPool.query(`DELETE FROM agents WHERE (account_id=$1 AND id=$2)`, [
                accountID,
                agentID,
            ]);
            if (deleteResult.rowCount > 0) {
                return {
                    completed: true,
                };
            }
            else {
                return {
                    completed: false,
                    faildItems: [agentID],
                };
            }
        }),
        deleteAgents: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        }),
        addAgent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID, agent } = args;
            const { username, firstname, lastname, email, avatar, phone, brief, password, roleID } = agent;
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
                password,
                roleID,
                accountID,
            ]);
            const agentID = addResult.rows[0].id;
            return (yield exports.resolvers.Query.agent(null, { agentID, accountID }));
        }),
        alterAgent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        }),
    },
};
//# sourceMappingURL=agent.js.map