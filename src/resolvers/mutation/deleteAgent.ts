import { postgresPool } from "@database/postgresql";
import { OperationStatus } from "@interfaces/OperationStatus";

export const deleteAgent = async (_: any, args: { accountID: string; agentID: string }): Promise<OperationStatus> => {
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
}