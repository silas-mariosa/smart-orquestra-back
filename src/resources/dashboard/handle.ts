import { db } from "../../db/drizzle-client";
import { eq, desc } from "drizzle-orm";
import { Louvores, Users } from "../../db/schema";

// Dashboard para Membros - 10 últimos louvores cadastrados
export const getDashboardMembros = async (orchestraId: string) => {
  try {
    const ultimosLouvores = await db
      .select()
      .from(Louvores)
      .where(eq(Louvores.orchestraId, orchestraId))
      .orderBy(desc(Louvores.createdAt))
      .limit(10);

    // Buscar os instrumentos relacionados
    const instrumentosIds = ultimosLouvores
      .map((louvor) => louvor.instrumentos)
      .filter((id): id is string => !!id);

    let instrumentosMap: Record<string, any> = {};
    let categoriasIds: string[] = [];
    if (instrumentosIds.length > 0) {
      const instrumentos = await db
        .select()
        .from(require("../../db/schema").Instruments)
        .where(
          require("drizzle-orm").inArray(
            require("../../db/schema").Instruments.id,
            instrumentosIds
          )
        );
      instrumentosMap = Object.fromEntries(
        instrumentos.map((inst: any) => [inst.id, inst])
      );
      // Coletar os IDs de categoria dos instrumentos
      categoriasIds = instrumentos
        .map((inst: any) => inst.categories)
        .filter((id: any): id is string => !!id);
    }

    // Buscar nomes das categorias
    let categoriasMap: Record<string, string> = {};
    if (categoriasIds.length > 0) {
      const categorias = await db
        .select()
        .from(require("../../db/schema").categoriesInstruments)
        .where(
          require("drizzle-orm").inArray(
            require("../../db/schema").categoriesInstruments.id,
            categoriasIds
          )
        );
      categoriasMap = Object.fromEntries(
        categorias.map((cat: any) => [cat.id, cat.name])
      );
    }

    // Montar o retorno com nome do instrumento, pdf, mp3 e nome da categoria
    const louvoresComInstrumentos = ultimosLouvores.map((louvor) => {
      const instrumentoId =
        typeof louvor.instrumentos === "string" ? louvor.instrumentos : "";
      const instrumento =
        instrumentoId && instrumentosMap[instrumentoId]
          ? instrumentosMap[instrumentoId]
          : {};
      const categoriaNome =
        instrumento.categories && categoriasMap[instrumento.categories]
          ? categoriasMap[instrumento.categories]
          : "";
      return {
        nome: louvor.nameLouvor,
        descricao: louvor.description,
        instrumento: instrumento.nameInstrument || louvor.instrumentos || "",
        categoria: categoriaNome,
        pdf: louvor.pdf || "",
        mp3: louvor.mp3 || "",
      };
    });

    return {
      ultimosLouvores: louvoresComInstrumentos,
      totalLouvores: louvoresComInstrumentos.length,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard de membros:", error);
    throw new Error("Erro ao buscar dados do dashboard");
  }
};

// Dashboard para Administradores
export const getDashboardAdmin = async (orchestraId: string) => {
  try {
    // Buscar total de usuários
    const todosUsuarios = await db
      .select()
      .from(Users)
      .where(eq(Users.orchestraId, orchestraId));

    // Buscar últimos 5 usuários cadastrados
    const ultimosUsuarios = await db
      .select()
      .from(Users)
      .where(eq(Users.orchestraId, orchestraId))
      .orderBy(desc(Users.createdAt))
      .limit(5);

    // Buscar últimos 10 louvores cadastrados
    const ultimosLouvores = await db
      .select()
      .from(Louvores)
      .where(eq(Louvores.orchestraId, orchestraId))
      .orderBy(desc(Louvores.createdAt))
      .limit(10);

    // Contar usuários por nível de acesso
    const usuariosPorNivel = todosUsuarios.reduce(
      (acc: Record<string, number>, usuario: any) => {
        const nivel = usuario.accessLevel || "Membro";
        acc[nivel] = (acc[nivel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      estatisticas: {
        totalUsuarios: todosUsuarios.length,
        totalLouvores: ultimosLouvores.length,
        usuariosPorNivel,
      },
      ultimosUsuarios: ultimosUsuarios || [],
      ultimosLouvores: ultimosLouvores || [],
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard admin:", error);
    throw new Error("Erro ao buscar dados do dashboard");
  }
};
