# Mindixo

- Catalog, categories and store content live in Supabase; public reads use a publishable server client with RLS, because drafts and ebook files must stay private.
- Admin privileges live only in user_roles and are granted explicitly by the project owner; never promote the first signup automatically.
- Cover uploads use a private bucket with public read policy and expiring read URLs; ebook files remain admin-only until paid delivery is connected.
- Keep the existing browser cart/wishlist, revalidate their contents against the live catalog, and never simulate checkout success.
- Adapt external design references in the existing TanStack routes and semantic tokens; retain the active catalog, auth and payment boundaries unless a service migration is explicitly requested.
- Unconfirmed book topics render as coming-soon presentation previews, separate from the live catalog, to avoid inventing saleable products or enabling purchases without files.
- The homepage header overlays the cover and switches to a solid contrasting surface on scroll; other pages use the solid header so navigation remains visible.
- Keep shop price-band predicates in a browser-safe utility with boundary tests so filter controls share deterministic limits.
