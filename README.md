# ChefKnight Encyclopedia Platform

ChefKnight is an open-source world-building “wiki” designed specifically for an animated series created by a writer + developer duo.  The goal is to make it effortless to **create** and **organise** lore — kingdoms, characters, regions, items, foods, continents, abilities, weapons, armour, races, religion, timelines, and more — while keeping everything in plain files that can be version-controlled and shared via GitHub.

## ✨ Key Ideas

* **Filesystem-driven content** – Every piece of lore is a file or folder inside the repo.  For example:
  ```text
  ChefKnight/
  ├── kingdoms/
  │   ├── avalon/
  │   │   ├── _meta.yaml   # core facts about the kingdom
  │   │   └── README.md    # long-form description / history
  │   └── nifelheim/
  ├── characters/
  │   ├── arthur_the_bold/
  │   │   ├── _meta.yaml   # tags: [avalon]
  │   │   └── README.md
  │   └── helga_iceborn/
  └── regions/
  ```
* **Tags & cross-linking** – Metadata (`_meta.yaml`) stores tags like `kingdom: avalon`, allowing the UI to pull all characters, locations, items, etc., related to a selected kingdom.
* **Content generation** – The app will provide forms / wizards to create new kingdoms, characters, etc. Submissions automatically create the correct folder + boilerplate files.
* **Git-native collaboration** – Each contributor keeps their own fork/clone.  The app can check for upstream changes and `git pull` them automatically.

## 🗺️ Planned Directory Structure

```
kingdoms/      # Top-level political entities
characters/    # All characters, tagged to kingdoms/regions
regions/       # Geographic areas (provinces, forests, seas…)
continents/    # Large landmasses spanning multiple regions
races/         # Sapient species or ethnic groups
foods/         # Cuisine, dishes, ingredients
abilities/     # Magical powers or special skills
weapons/       # Armaments
armour/        # Protective gear
items/         # Artifacts, key objects not covered above
religion/      # Deities, belief systems
lore/          # Myths, events, timelines, miscellaneous articles
ui/            # Front-end application (e.g., Next.js / SvelteKit)
backend/       # API & logic (e.g., Python FastAPI / Node Express)
```

## 🚀 Roadmap (draft)

1. Bootstrap repo with base folders & sample content templates.
2. Choose tech stack for the interactive UI (e.g., Electron + SvelteKit or Pure Web).
3. Implement content generator: create-kingdom ▶ creates folder + stub files.
4. Build tag parser that aggregates content for a selected kingdom.
5. Add convenient Git synchronisation commands from within the UI.
6. Package app for local use & optionally deploy a read-only public site.

## 🤔 Open Questions

1. **Tech stack preference?**  Web (React/Svelte) vs. desktop (Electron/Tauri)?
2. **Content format?**  Markdown + YAML front-matter, pure JSON, or something else?
3. **Auto-sync behaviour?**  Should the app `git pull` on start-up, on a timer, or manually?
4. **Access control?**  Will there be private vs. public lore sections?
5. **Versioning of generated assets** (images, audio) if those will be added later?

Please let me know your thoughts so we can refine the plan and start scaffolding the project!
