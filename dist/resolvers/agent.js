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
            const results = yield postgresql_1.postgresPool.query(`SELECT * FROM agents WHERE account_id=${accountID}`);
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
                        roles.set(agent.role, {
                            id: role.id,
                            name: role.name,
                            permission: role.permission,
                        });
                    }
                    const role_type = roles.get(agent.role_type);
                    agents.push({
                        id: agent.id,
                        username: agent.username,
                        first_name: agent.first_name,
                        last_name: agent.last_name,
                        email: agent.email,
                        avatar: agent.avatar,
                        phone: agent.phone,
                        password: agent.password,
                        brief: agent.brief,
                        role_type,
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
            const agentResult = yield postgresql_1.postgresPool.query(`SELECT * FROM agents WHERE (account_id=${accountID} AND id=${agentID})`);
            if (agentResult.rowCount === 1) {
                const agent = agentResult.rows[0];
                let role_type = void 0;
                if (agent.role) {
                    const roleResult = yield postgresql_1.postgresPool.query("SELECT * FROM roles WHERE (id=$1)", [
                        agent.role,
                    ]);
                    if (roleResult.rowCount !== 1) {
                        throw new Error("Rule not found");
                    }
                    role_type = roleResult.rows[0];
                }
                return {
                    id: agent.id,
                    username: agent.username,
                    first_name: agent.first_name,
                    last_name: agent.last_name,
                    email: agent.email,
                    avatar: agent.avatar,
                    phone: agent.phone,
                    password: agent.password,
                    brief: agent.brief,
                    role_type
                };
            }
            else {
                return void "Agent doesn't exist";
            }
        }),
    },
    Mutation: {
        // Products
        deleteAgent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID, agentID } = args;
            const deleteResult = yield postgresql_1.postgresPool.query(`DELETE FROM agents WHERE (account_id=${accountID} AND id=$1)`, [
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
                    const deleteResult = yield postgresql_1.postgresPool.query(`DELETE FROM agents WHERE (account_id=${accountID} AND id=$1)`, [id]);
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
            const { username, first_name, last_name, email, avatar, phone, brief, password, roleID } = agent;
            const addResult = yield postgresql_1.postgresPool.query(`
      INSERT INTO agents(username, first_name, last_name, email, avatar, phone, brief, password, role, account_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `, [
                username,
                first_name,
                last_name,
                email,
                avatar,
                phone,
                brief || "N/A",
                password,
                roleID || null,
                accountID,
            ]);
            return (yield exports.resolvers.Query.agent(null, { agentID: addResult.rows[0].id, accountID }));
        }),
        alterAgent: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { accountID, agent } = args;
            const { id, username, first_name, last_name, email, avatar, phone, brief, password, roleID } = agent;
            // We will use the transaction in this case
            const updateResult = yield postgresql_1.postgresPool.query(`
      BEGIN;
      /* Update the agent */
      UPDATE agents SET username=$1 first_name=$2 
      last_name=$3 email=$4 avatar=$5 phone=$6 password=$7 brief=$8 role=$9
      WHERE (account_id=$10 AND id=$11)
      
      
      COMMIT;`, [username, first_name, last_name, email, avatar, phone, brief, password, roleID, accountID, id]);
            if (updateResult.rowCount > 0) {
                return { completed: true };
            }
            else {
                return { completed: false, faildItems: [agent.id] };
            }
        }),
    },
};
