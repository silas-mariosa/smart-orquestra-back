# Usa a última versão do Bun
FROM oven/bun:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos essenciais primeiro para otimizar cache
COPY package.json ./

# Instala as dependências
RUN bun install

# Copia o restante dos arquivos do projeto
COPY . .

# Define o ambiente como produção
ENV NODE_ENV production

# Comando para iniciar o servidor
CMD ["bun", "run", "start"]
