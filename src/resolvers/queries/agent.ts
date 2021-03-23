import { postgresPool } from "@database/postgresql";
import { Agent } from "@interfaces/Agent";
import { Permission } from "@interfaces/Permission";
import { getAgent } from "@utils/getAgent";
import { getPermission } from "@utils/getPermission";
import { getRole } from "@utils/getRole";

export const agent = async (_: any, args: { agentID: string }): Promise<Agent | void> => {

    const { agentID } = args;
    const agentResult = await getAgent(agentID, postgresPool);

    if (agentResult.rowCount === 1) {
      const agent = agentResult.rows[0];
      
      const roleResult = await getRole(agent.role, postgresPool)

      if (roleResult.rowCount !== 1) {
        throw new Error("Rule not found");
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
}