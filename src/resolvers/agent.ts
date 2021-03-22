import { postgresPool } from "../database/postgresql";
import { OperationStatus } from "../interface/OperationStatus";
import { Agent } from "../interface/Agent";
import { AgentAdd } from "../interface/AgentToAdd";
import { Role } from "../interface/Role";
import { Permission } from "../interface/Permission";
import { AgentUpdate } from "../interface/AgentToUpdate";

export const resolvers = {
  Query: {
    agents: async (_: any, args: { accountID: string }): Promise<Agent[]> => {
      const { accountID } = args;
      const agents: Array<Agent> = [];
      const results = await postgresPool.query(`SELECT * FROM agents WHERE account_id=$1`, [accountID]);
      const roles = new Map<string, Role>();

      for (const agent of results.rows) {
        try {
            if (agent.role && !roles.has(agent.role)) {
                const roleResult = await postgresPool.query("SELECT * FROM roles WHERE (id=$1)", [
                  agent.role,
                ]);
    
                if (roleResult.rowCount !== 1) {
                  throw new Error("Role not found");
                }
                const role = roleResult.rows[0];
                
                const permissions: Array<Permission> = []

                for(const permissionId of role.permission){
                  const permissionResult = await postgresPool.query("SELECT * FROM permissions WHERE (id=$1)", [
                    permissionId,]);

                  if (permissionResult.rowCount !== 1) {
                    throw new Error("Permission not found");
                  }
                  
                  const permission = permissionResult.rows[0];

                  permissions.push({
                    id: permission.id,
                    name: permission.title,
                    description: permission.value
                  })
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
        } catch (e) {
          console.error(`faild to fetch : ${e}`);
        }
      }

      return agents;
    },

    agent: async (_: any, args: { agentID: string; accountID: string }): Promise<Agent | void> => {

      const { accountID, agentID } = args;
      const agentResult = await postgresPool.query(
        `SELECT * FROM agents WHERE (account_id=$1 AND id=$2)`, [
          accountID,
          agentID
        ]
      );

      if (agentResult.rowCount === 1) {
        const agent = agentResult.rows[0];
        
        const roleResult = await postgresPool.query(
          "SELECT * FROM roles WHERE (id=$1)", [agent.role,]);

        if (roleResult.rowCount !== 1) {
          throw new Error("Rule not found");
        }
        
        const role = roleResult.rows[0];

        const permissions: Array<Permission> = []

        for(const permissionId of role.permission){
          const permissionResult = await postgresPool.query("SELECT * FROM permissions WHERE (id=$1)", [
            permissionId,]);

          if (permissionResult.rowCount !== 1) {
            throw new Error("Permission not found");
          }
          
          const permission = permissionResult.rows[0];

          permissions.push({
            id: permission.id,
            name: permission.title,
            description: permission.value
          })
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
      } else {
        return void "Agent doesn't exist";
      }
    },
  },
  
  Mutation: {
    // Agents
    deleteAgent: async (_: any, args: { accountID: string; agentID: string }): Promise<OperationStatus> => {
      const { accountID, agentID } = args;

      const deleteResult = await postgresPool.query(`DELETE FROM agents WHERE (account_id=$1 AND id=$2)`, [
        accountID,
        agentID,
      ]);

      if (deleteResult.rowCount > 0) {
        return {
          completed: true,
        };
      } else {
        return {
          completed: false,
          faildItems: [agentID],
        };
      }
    },

    deleteAgents: async (_: any, args: { accountID: string; agentsID: string[] }): Promise<OperationStatus> => {
      const { accountID, agentsID } = args;
      const faildItems: Array<string> = [];

      for (const id of agentsID) {
        try {
          const deleteResult = await postgresPool.query(
            `DELETE FROM agents WHERE (account_id=$1 AND id=$2)`,[
              accountID,
              id
            ]
          );
          if (deleteResult.rowCount === 0) {
            faildItems.push(id);
          }
        } catch (e) {
          console.error(e);
          faildItems.push(id);
          continue;
        }
      }

      return {
        completed: faildItems.length === 0,
        faildItems,
      };
    },

    addAgent: async (_: any, args: { accountID: string; agent: AgentAdd }): Promise<Agent> => {
      const { accountID, agent } = args;
      const { username, firstname, lastname, email, avatar, phone, brief , password, roleID } = agent
      
      const addResult = await postgresPool.query(
        `
      INSERT INTO agents(username, first_name, last_name, email, 
        avatar, phone, brief, password, role, account_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `,
        [
          username,
          firstname,
          lastname,
          email ,
          avatar,
          phone,
          brief || "N/A",
          password,
          roleID,
          accountID,
        ]
      );
      const agentID = addResult.rows[0].id;

      return (await resolvers.Query.agent(null, { agentID, accountID })) as Agent;
    },

    alterAgent: async (
      _: any,
      args: { accountID: string; agent: AgentUpdate }
    ): Promise<OperationStatus> => {
      const { accountID, agent } = args;

      const { id, username, firstname, lastname, email, avatar, phone, brief , password, roleID } = agent;
     
      // We will use the transaction in this case
      const updateResult = await postgresPool.query(
        `
      BEGIN;
      /* Update the agent */
      UPDATE agents SET username=$1 first_name=$2 
      last_name=$3 email=$4 avatar=$5 phone=$6 brief=$7 password=$8 role=$9
      WHERE (account_id=$10 AND id=$11)      
      
      COMMIT;`,
        [username, firstname, lastname, email, avatar, phone, brief, password, roleID, accountID, id]
      );

      if (updateResult.rowCount > 0) {
        return { completed: true };
      } else {
        return { completed: false, faildItems: [agent.id] };
      }
    },

  },
};