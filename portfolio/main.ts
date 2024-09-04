

import { z } from "zod";
import { ProjectArraySchema, type Project } from "./types";

const form = document.getElementById("project_form") as HTMLFormElement;
const projectsList = document.getElementById("projectsList") as HTMLUListElement;
const projects: Project[] = [];


form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
  
    const newProject = {
      tittel: (
        (event.target as HTMLFormElement).elements.namedItem(
          "title_input"
        ) as HTMLInputElement
      )?.value,
      url: (
        (event.target as HTMLFormElement).elements.namedItem(
          "url_input"
        ) as HTMLInputElement
      )?.value,
      beskrivelse: (
        (event.target as HTMLFormElement).elements.namedItem(
          "description"
        ) as HTMLInputElement
      )?.value
    };
  
    projects.push(newProject);
    updateProjectsList();
  
    try {
      const response = await fetch("http://localhost:3999/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });
  
      if (response.status === 201) {
        console.log("Prosjekt er lagt til");
      } else {
        console.error("Feil ved lagring av prosjekt på serveren");
      }
    } catch (error) {
      console.error("Feil ved sending av data til serveren:", error);
    }
  });
  
  function updateProjectsList() {
    console.log(projects);
    if (!projectsList) return;
    projectsList.innerHTML = "";
  
    for (const project of projects) {
        const element = document.createElement("article");
        element.className = "article_card";
        
        const project_title = document.createElement("h3");  
        project_title.textContent = project.tittel;
        
        const project_description = document.createElement("p");  
        project_description.textContent = project.beskrivelse;
       
        const project_url = document.createElement("a");  
        project_url.textContent = "Les mer om prosjektet";
        project_url.href = project.url;
        project_url.className = "project_link";
        

        element.appendChild(project_title);
        element.appendChild(project_url);
        element.appendChild(project_description);
        

        projectsList.appendChild(element);
    }
  }
  
  function loadFromApi() {
    fetch("http://localhost:3999/json")
      .then((response) => response.json())
      .then((data: unknown) => {
        try {
          // Forsøker å parse og validere dataene med Zod-skjemaet
          const validatedProjects = ProjectArraySchema.parse(data);
  
          projects.push(...validatedProjects); // Legger til validerte vaner i den interne listen
          updateProjectsList(); // Oppdaterer visningen på nettsiden
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Ugyldig data mottatt fra serveren:", error.errors);
          } else {
            console.error("Uventet feil ved validering av data:", error);
          }
        }
      })
      .catch((error: Error) => {
        console.error("Feil ved henting av data fra serveren:", error);
      });
  }

  function loadFromJSON() {
    fetch("./prosjektdata.json")
      .then((response) => {
        // Konverterer data til json format
        return response.json();
      })
      .then((data) => {
        // Henter ut div med id `data`
        const jsonId = document.getElementById("json");
        // Debugging
        console.log(data);
        // Går igjennom dataen og lager en `p` til hvert element.
        for (const project of data) {
            const newElement = document.createElement("article");
            newElement.className = "article_card";
            
            const project_title = document.createElement("h3");  
            project_title.textContent = project.tittel;
            
            const project_url = document.createElement("a");  
            project_url.textContent = "Les mer om prosjektet";
            project_url.href = project.url;
            project_url.className = "project_link";

            const project_description = document.createElement("p");  
            project_description.textContent = project.beskrivelse;
        
            
            

            newElement.appendChild(project_title);
            newElement.appendChild(project_description);
            newElement.appendChild(project_url);
            

            jsonId?.appendChild(newElement);
        }
      });
  }
  
  loadFromJSON();
  loadFromApi();



/*
const fetchDataFromServer = async () => {
    const response = await fetch("http://localhost:3999/json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
  
    console.log(result);
  
    const id = document.getElementById("json");
    if (!id) return;    
    //id.innerHTML = result; 

    
    for (const project of result) {
        const element = document.createElement("article");
        element.className = "article_card";
        
        const project_title = document.createElement("h3");  
        project_title.textContent = project.tittel;
        
        const project_description = document.createElement("p");  
        project_description.textContent = project.beskrivelse;
       
        const project_url = document.createElement("a");  
        project_url.textContent = "Les mer om prosjektet";
        project_url.href = project.url;
        project_url.className = "project_link";
        

        element.appendChild(project_title);
        element.appendChild(project_description);
        element.appendChild(project_url);

        id.appendChild(element);
    }
  };
  
  fetchDataFromServer();

*/