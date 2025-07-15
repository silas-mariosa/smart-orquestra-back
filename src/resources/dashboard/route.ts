import { Elysia } from "elysia";
import { JWT } from "../../jwt";
import { getDashboardMembros, getDashboardAdmin } from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Dashboard"],
  },
};

export const dashboard = new Elysia({ prefix: "/dashboard" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/membros",
        async ({ jwt, error, headers }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }
            return await getDashboardMembros(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/admin",
        async ({ jwt, error, headers }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }

            // Verificar se o usuário é administrador
            const accessLevel = profile.accessLevel;
            if (accessLevel !== "Administrador") {
              return error(
                403,
                "Acesso negado. Apenas administradores podem acessar este dashboard."
              );
            }

            return await getDashboardAdmin(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );
