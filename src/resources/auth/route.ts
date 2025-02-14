import { Elysia, t } from "elysia";
import { JWT } from "../../jwt";
import { signUpNewUser } from "./handler";
import { postUsers } from "../usuario/haddle";
import { postOrchestra } from "../orquestra/handle";

const swaggerGroup = {
  detail: {
    tags: ["Auth"],
  },
};

export const auth = new Elysia({ prefix: "/auth" }).use(JWT).guard(
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      senha: t.String(),
    }),
  },
  (app) =>
    app.post(
      "/signup",
      async ({ body, jwt, cookie: { authTokenSmart } }) => {
        try {
          const { data, error } = await signUpNewUser(body);

          if (error) throw new Error(error);

          const authId = data?.id;
          if (authId === undefined)
            throw new Error("Authentication ID is undefined");

          const name = data?.name;
          if (name === undefined) throw new Error("Name is undefined");

          const [newOrchestra] = await postOrchestra({
            nome_orchestra: body.name,
            user_auth: authId,
            auth_id: authId,
          });

          const newUser = await postUsers({
            auth_id: authId,
            orchestraId: newOrchestra.id,
            accessLevel: "Administrador",
            name: name,
            instrumentId: 0,
            groupId: 0,
          });
        } catch (error) {}
      },
      swaggerGroup
    )
);
