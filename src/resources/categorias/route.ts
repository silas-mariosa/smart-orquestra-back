import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  postCategory,
  updateCategory,
} from "./handdle";

const swaggerGroup = {
  detail: {
    tags: ["Categorias"],
  },
};

export const categorias = new Elysia({ prefix: "/categorias" })
  .use(JWT)
  .guard((app) =>
    app
      .get(
        "/",
        async ({ jwt, error, headers, cookie: { authTokenEasy } }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              throw new Error("Invalid Token");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              error(400, "Invalid orchestraId");
            }
            return await getAllCategories(orchestraId as string);
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

            const categoryById = await getCategoryById(
              id,
              orchestraId as string
            );
            if (!categoryById) {
              return error(404, "Category not found");
            } else {
              return categoryById;
            }
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .guard(
        {
          body: t.Object({
            name: t.String(),
          }),
        },
        (app) =>
          app
            .post(
              "/",
              async ({ body, error, headers, jwt }) => {
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

                  return await postCategory(body.name, orchestraId as string);
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
                  return await updateCategory(id, body.name);
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
            return await deleteCategory(id, orchestraId as string);
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );
