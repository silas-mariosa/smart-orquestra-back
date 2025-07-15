import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  getAllEnsaios,
  createEnsaio,
  updateEnsaio,
  deleteEnsaio,
} from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Ensaios"],
  },
};

export const ensaios = new Elysia({ prefix: "/ensaios" })
  .use(JWT)
  .get(
    "/",
    async ({ jwt, headers, error }) => {
      const authToken = headers.authorization?.split(" ")[1];
      console.log("authToken: ", authToken);
      try {
        const profile = await jwt.verify(authToken);
        console.log("profile: ", profile);
        if (!profile) return error(401, "Token inválido");
        const orchestraId = profile.orchestraId;
        console.log("orchestraId: ", orchestraId);
        if (!orchestraId) return error(400, "orchestraId inválido");
        const ensaios = await getAllEnsaios(String(orchestraId));
        console.log("ensaios: ", ensaios);
        return ensaios;
      } catch (err) {
        return error(400, "Erro ao buscar ensaios");
      }
    },
    swaggerGroup
  )
  .guard(
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        start: t.String(),
        end: t.Optional(t.String()),
        date: t.String(),
      }),
    },
    (app) =>
      app.post(
        "/",
        async ({ body, jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          console.log("Body: ", body);
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) return error(401, "Token inválido");
            if (profile.accessLevel !== "Administrador")
              return error(403, "Apenas administradores podem criar ensaios");
            const orchestraId = profile.orchestraId;
            if (!orchestraId) return error(400, "orchestraId inválido");
            return await createEnsaio({ ...body, orchestraId });
          } catch (err) {
            console.error("Erro detalhado ao criar ensaio:", err);
            return error(400, "Erro ao criar ensaio");
          }
        },
        swaggerGroup
      )
  )
  .guard(
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        start: t.String(),
        end: t.Optional(t.String()),
        date: t.String(),
      }),
    },
    (app) =>
      app.put(
        ":id",
        async ({ params: { id }, body, jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) return error(401, "Token inválido");
            if (profile.accessLevel !== "Administrador")
              return error(403, "Apenas administradores podem editar ensaios");
            return await updateEnsaio(id, body);
          } catch (err) {
            return error(400, "Erro ao editar ensaio");
          }
        },
        swaggerGroup
      )
  )
  .delete(
    ":id",
    async ({ params: { id }, jwt, headers, error }) => {
      const authToken = headers.authorization?.split(" ")[1];
      try {
        const profile = await jwt.verify(authToken);
        if (!profile) return error(401, "Token inválido");
        if (profile.accessLevel !== "Administrador")
          return error(403, "Apenas administradores podem remover ensaios");
        return await deleteEnsaio(id);
      } catch (err) {
        return error(400, "Erro ao remover ensaio");
      }
    },
    swaggerGroup
  );
