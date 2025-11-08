import { sql } from "../../supabase";
import { Developers } from "../../types";

export async function cargarCompanies() {
  let url = `https://api.rawg.io/api/developers?key=${process.env.RAW_KEY}`;
  
  while (url) {
    const res = await fetch(url);
    const data:Developers = await res.json();

    for (const dev of data.results) {
      await sql/*sql*/`
        INSERT INTO companies (name)
        VALUES (${dev.name})
        ON CONFLICT (name) DO NOTHING
      `;
    }

    url = data.next; // sigue a la siguiente página
  }

  console.log("✅ Companies cargadas");
  await sql.end();
}

