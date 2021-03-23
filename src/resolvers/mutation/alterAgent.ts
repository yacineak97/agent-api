import { postgresPool } from "@database/postgresql";
import { AgentUpdate } from "@interfaces/AgentToUpdate";
import { OperationStatus } from "@interfaces/OperationStatus";

export const alterAgent = async (_: any, args: { 
    accountID: string; 
    agent: AgentUpdate 
  }): Promise<OperationStatus> => {
    const { accountID, agent } = args;

    const { id, username, firstname, lastname, email, avatar, phone, brief , password, roleID } = agent;
   
    const updateResult = await postgresPool.query(
      `
    /* Update the agent */
    UPDATE agents SET username=$1, first_name=$2, 
    last_name=$3, email=$4, avatar=$5, phone=$6, brief=$7, password=$8, role=$9
    WHERE (account_id=$10 AND id=$11) ;   
    `,
      [username, firstname, lastname, email, avatar, phone, brief, password, roleID, accountID, id]
    );

    if (updateResult.rowCount > 0) {
      return { completed: true };
    } else {
      return { completed: false, faildItems: [agent.id] };
    }
  }