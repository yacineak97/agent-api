import { Pool } from 'pg';

export const getPermission= async (permissionID: string, postgresPool: Pool) => {
  const result = await postgresPool.query(`SELECT * FROM permissions WHERE (id=$1)`, [
    permissionID
  ]);
  return result;
};