import { Pool } from 'pg';

export const getRole = async (agentRole: string, postgresPool: Pool) => {
  const result = await postgresPool.query(`SELECT * FROM roles WHERE (id=$1)`, [
    agentRole
  ]);

  return result;
};