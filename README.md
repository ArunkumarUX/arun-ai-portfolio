# Arun AI Portfolio

Static portfolio site: Home → Selected Work (6) → All Work (searchable/filterable) → Experience → About → Contact.

```bash
python3 -m http.server 8790 --directory "/Users/arunkumarg/Desktop/AI Projects/Arun AI Portfolio"
```

- `data.js` holds every project, the featured list and experience. Edit that file only to add or change projects.
- Projects were collected from github.com/ArunkumarUX and local folders (`~/Desktop/AI Projects`, `~/Developer`, `~/`).
- Private repos are never linked; only public repos and live deployments are.
- Third-party code (Claw3D, LLMs-from-scratch, video-use, Higgsfield plugin) and non-portfolio folders (Election, KLA interview, Bible, cowork guide) are excluded.

Deploy: drag the folder into Vercel/Netlify, or `vercel --prod` from this folder.
