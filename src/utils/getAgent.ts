import { Pool } from 'pg';

export const getAgent = async (agentID: string, postgresPool: Pool) => {
  const result = await postgresPool.query(`SELECT * FROM agents WHERE id=$1`, [
    agentID,
  ]);

  return result;
};