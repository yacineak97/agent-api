import { postgresPool } from "@database/postgresql";
import { OperationStatus } from "@interfaces/OperationStatus";

export const deleteAgents = async (_: any, args: { accountID: string; agentsID: string[] }): Promise<OperationStatus> => {
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
}