import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  const libsql = createClient({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
  // @ts-ignore - The underlying client works fine, but types strictly conflict
  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;