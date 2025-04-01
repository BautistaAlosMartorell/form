import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const respuestas = sqliteTable("respuestas", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  grade: text("grade").notNull(),
  respuesta2: text("respuesta2"),
  respuesta3: text("respuesta3"),
  respuesta4: text("respuesta4"),
  respuesta5: text("respuesta5"),
  respuesta6: text("respuesta6"),
  respuesta7: text("respuesta7"),
  respuesta8: text("respuesta8"),
  respuesta9: text("respuesta9"),
  respuesta10: text("respuesta10"),
  respuesta11: text("respuesta11"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});