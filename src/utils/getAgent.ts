import { Pool } from 'pg';

export const getAgent = async (accountID: string, agentID: string, postgresPool: Pool) => {
  const result = await postgresPool.query(`SELECT * FROM agents WHERE (account_id=$1 AND id=$2)`, [
    accountID,
    agentID,
  ]);

  return result;
};