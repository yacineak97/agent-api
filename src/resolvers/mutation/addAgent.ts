import { postgresPool } from "@database/postgresql";
import { Agent } from "@interfaces/Agent";
import { AgentAdd } from "@interfaces/AgentToAdd";
import { agent as ag } from "@resolvers/queries/agent";

export const addAgent = async (_: any, args: { accountID: string; agent: AgentAdd }): Promise<Agent> => {
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

    return (await ag(null, { agentID, accountID })) as Agent;
}