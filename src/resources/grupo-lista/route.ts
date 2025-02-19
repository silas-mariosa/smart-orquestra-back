import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  deleteListGroup,
  getAllInListGroups,
  getListGroupById,
  postListGroup,
  updateListGroup,
} from "./handle";

const swaggerGroup = {
  detail: {
    tags: ["Lista de Grupos"],
  },
};

export const grupoLista = new Elysia({ prefix: "/grupo-lista" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/",
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
            return await getAllInListGroups(orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/:id",
        async ({ params: { id }, jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(400, "Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }
            return await getListGroupById(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            GroupId: t.String(),
          }),
        },
        (app) =>
          app
            .post(
              "/",
              async ({ body, jwt, headers, error }) => {
                const authToken = headers.authorization?.split(" ")[1];
                try {
                  const profile = await jwt.verify(authToken);
                  if (!profile) {
                    return error(400, "Invalid Token");
                  }
                  const orchestraId = profile.orchestraId;
                  if (!orchestraId) {
                    return error(400, "Invalid orchestraId");
                  }

                  const userId = profile.userId;
                  if (!userId) {
                    return error(400, "Invalid userId");
                  }
                  return await postListGroup({
                    GroupId: body.GroupId,
                    orchestraId: orchestraId as string,
                    userId: userId as string,
                  });
                } catch (error) {
                  return error;
                }
              },
              swaggerGroup
            )
            .put(
              "/:id",
              async ({ params: { id }, body, jwt, headers, error }) => {
                const authToken = headers.authorization?.split(" ")[1];
                try {
                  const profile = await jwt.verify(authToken);
                  if (!profile) {
                    return error(400, "Invalid Token");
                  }
                  const orchestraId = profile.orchestraId;
                  if (!orchestraId) {
                    return error(400, "Invalid orchestraId");
                  }
                  return await updateListGroup({
                    id: id,
                    GroupId: body.GroupId,
                    orchestraId: orchestraId as string,
                  });
                } catch (error) {
                  return error;
                }
              },
              swaggerGroup
            )
      )
      .delete(
        "/:id",
        async ({ params: { id }, jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(400, "Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }
            return await deleteListGroup(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );
