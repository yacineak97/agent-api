import { postgresPool } from "@database/postgresql";
import { Agent } from "@interfaces/Agent";
import { Permission } from "@interfaces/Permission";
import { Role } from "@interfaces/Role";
import { getPermission } from "@utils/getPermission";
import { getRole } from "@utils/getRole";


export const agents = async (_: any): Promise<Agent[]> => {
    const agents: Array<Agent> = [];
    const results = await postgresPool.query(`SELECT * FROM agents`);
    const roles = new Map<string, Role>();

    for (const agent of results.rows) {
      try {
          if (agent.role && !roles.has(agent.role)) {
              const roleResult = await getRole(agent.role, postgresPool);
  
              if (roleResult.rowCount !== 1) {
                throw new Error("Role not found");
              }
              const role = roleResult.rows[0];
              
              const permissions: Array<Permission> = []

              for(const permissionID of role.permission){
                const permissionResult = await getPermission(permissionID, postgresPool);

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
}