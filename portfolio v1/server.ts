import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile, writeFile } from "node:fs/promises";
import { ProjectSchema, type Project } from "./types.ts";


const app = new Hono();

app.use("/*", cors());

app.use("/statics/*", serveStatic({ root: "./" }));

// Setter typen til projects til å være en array av Project
const projects: Project[] = JSON.parse(await readFile("prosjektdata.json", "utf-8"));

app.get("/json", async (c: { json: (arg0: any) => any; }) => {
    const data = await readFile("prosjektdata.json", "utf-8");
    //return c.json(data);
    return c.json(JSON.parse(data));
    //return c.json({"id": 1});
});

app.post("/add", async (c) => {
    const newProject = await c.req.json();
    // Validerer at dataen vi mottar er en gyldig Project
    const project = ProjectSchema.parse(newProject);
    // Sjekker om project er en gyldig Project, og returnerer en feilmelding hvis ikke
    if (!project) return c.json({ error: "Invalid project" }, { status: 400 });
    console.log(project);
    projects.push(project);
    writeFile("prosjektdata.json", JSON.stringify(projects, null, 2));
    // Returnerer en liste med alle habits. Bruker generisk type for å fortelle at vi returnerer en array av Habit
    return c.json(projects, { status: 201 });
  });


const port = 3999;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
}); 