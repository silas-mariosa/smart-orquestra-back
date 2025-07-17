import { Elysia, t } from "elysia";
import {
  getAllUsers,
  getUsersById,
  postUsers,
  updateUsers,
  postUsersWithRandomPassword,
  generateNewPasswordForUser,
  updateUserPassword,
} from "./haddle";
import { JWT } from "../../jwt";
import { getInstrumentListByUserIDWithName } from "../instrumentos-lista/handle";

interface UsuarioRequestBody {
  auth_id: string;
  orchestraId: string;
  accessLevel: "Administrador" | "Membro";
  name: string;
  instrumentId: string;
  groupId: string;
}

const swaggerGroup = {
  detail: {
    tags: ["Usuarios"],
  },
};

export const usuario = new Elysia({ prefix: "/usuario" })
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
              error(400, "Invalid orchestraId");
            }
            const usuarios = await getAllUsers(orchestraId as string);
            // Para cada usuário, buscar instrumentos
            const usuariosComInstrumentos = await Promise.all(
              usuarios.map(async (usuario: any) => {
                const instrumentos = await getInstrumentListByUserIDWithName(
                  usuario.id
                );
                return {
                  usuario,
                  instrumentos: instrumentos || [],
                };
              })
            );
            return usuariosComInstrumentos;
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
      .get(
        "/me",
        async ({ jwt, headers, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(404, "Invalid Token");
            }
            const id = profile.userId as string;
            if (!id) {
              return error(404, "Invalid id");
            }
            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(404, "Invalid orchestraId");
            }

            const usuarioById = await getUsersById(id, orchestraId as string);
            if (!usuarioById) {
              return error(400, "Usuario não encontrado!");
            } else {
              return usuarioById;
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
            auth_id: t.String(),
            orchestraId: t.String(),
            accessLevel: t.String(),
            name: t.String(),
            instrumentListId: t.String(),
            groupId: t.String(),
          }),
        },
        (app) =>
          app.post(
            "/",
            async (
              { body }: { body: UsuarioRequestBody },
              { headers, jwt }: any
            ) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  throw new Error("Invalid Token");
                }
                return await postUsers(body);
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
      .guard(
        {
          body: t.Object({
            name: t.String(),
            brithday: t.String(),
            whatsapp: t.String(),
            cep: t.String(),
            estado: t.String(),
            cidade: t.String(),
            bairro: t.String(),
            endereco: t.String(),
            numero: t.String(),
            complemento: t.String(),
          }),
        },
        (app) =>
          app.put(
            "/update-usuario",
            async ({ body, headers, jwt, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              console.log("Body: ", body);
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(404, "Invalid Token");
                }
                const id = profile.userId as string;
                if (!id) {
                  return error(404, "Invalid id");
                }
                return await updateUsers(
                  id,
                  body.name,
                  body.brithday,
                  body.cep,
                  body.estado,
                  body.cidade,
                  body.bairro,
                  body.endereco,
                  body.numero,
                  body.complemento,
                  body.whatsapp
                );
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
      .guard(
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
            accessLevel: t.String(),
          }),
        },
        (app) =>
          app.post(
            "/create-with-password",
            async ({ body, headers, jwt, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(400, "Invalid Token");
                }

                // Verificar se o usuário é administrador
                const accessLevel = profile.accessLevel;
                if (accessLevel !== "Administrador") {
                  return error(
                    403,
                    "Acesso negado. Apenas administradores podem criar usuários."
                  );
                }

                const orchestraId = profile.orchestraId;
                if (!orchestraId) {
                  return error(400, "Invalid orchestraId");
                }

                const result = await postUsersWithRandomPassword({
                  orchestraId: orchestraId as string,
                  accessLevel: body.accessLevel,
                  name: body.name,
                  email: body.email,
                });

                return {
                  message: "Usuário criado com sucesso",
                  user: result.user,
                  password: result.password, // Senha gerada para ser passada ao usuário
                };
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
      .guard(
        {
          body: t.Object({
            newPassword: t.String(),
          }),
        },
        (app) =>
          app.put(
            "/update-password",
            async ({ body, headers, jwt, error }) => {
              const authToken = headers.authorization?.split(" ")[1];
              try {
                const profile = await jwt.verify(authToken);
                if (!profile) {
                  return error(404, "Invalid Token");
                }
                const userId = profile.userId as string;
                if (!userId) {
                  return error(404, "Invalid userId");
                }
                const orchestraID = profile.orchestraId as string;
                if (!orchestraID) {
                  return error(404, "Invalid orchestraID");
                }
                // Buscar o usuário para pegar o auth_id
                const [usuario] = await getUsersById(userId, orchestraID);
                if (!usuario) {
                  return error(
                    404,
                    "Usuário não encontrado ou auth_id ausente"
                  );
                }
                const auth_id = String(usuario.user.auth_id);
                const result = await updateUserPassword(
                  auth_id,
                  body.newPassword
                );
                if (!result) {
                  return error(400, "Erro ao atualizar senha");
                }
                return { message: "Senha atualizada com sucesso" };
              } catch (error) {
                return error;
              }
            },
            swaggerGroup
          )
      )
      .post(
        "/:id/reset-password",
        async ({ params: { id }, headers, jwt, error }) => {
          const authToken = headers.authorization?.split(" ")[1];
          try {
            const profile = await jwt.verify(authToken);
            if (!profile) {
              return error(400, "Invalid Token");
            }

            // Verificar se o usuário é administrador
            const accessLevel = profile.accessLevel;
            if (accessLevel !== "Administrador") {
              return error(
                403,
                "Acesso negado. Apenas administradores podem redefinir senhas."
              );
            }

            const orchestraId = profile.orchestraId;
            if (!orchestraId) {
              return error(400, "Invalid orchestraId");
            }

            const result = await generateNewPasswordForUser(
              id,
              orchestraId as string
            );

            return {
              message: "Senha redefinida com sucesso",
              user: result.user,
              newPassword: result.newPassword, // Nova senha para ser passada ao usuário
            };
          } catch (error) {
            return error;
          }
        },
        swaggerGroup
      )
  );
