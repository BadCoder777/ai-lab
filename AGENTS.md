<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DesignLab Frontend — Project Overview

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.10 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x (CSS-based config, no `tailwind.config`) |
| Animations | Framer Motion | 12.x |
| Icons | Lucide React | 1.x |
| Package Manager | Bun | latest |
| Linting | ESLint | 9.x (flat config) |

## Route Structure

```
app/
  layout.tsx                          # Root layout (html, body only — no sidebar)
  globals.css                         # Tailwind v4 entrypoint, dark theme, custom scrollbar
  (sidebar)/                          # Route group — pages WITH the left sidebar
    layout.tsx                        # Renders <Sidebar /> + <main>
    page.tsx                          # / — Recent projects (default landing)
    projects/page.tsx                 # /projects — All projects
    collections/page.tsx              # /collections — Collection list (file-manager rows)
    collections/[id]/page.tsx         # /collections/[id] — Projects inside a collection
    recent/page.tsx                   # /recent — Redirects to /
    trash/page.tsx                    # /trash — Deleted projects with clean-trash flow
  projects/[id]/page.tsx              # /projects/[id] — Project detail, NO sidebar
```

**Route-group pattern:** The `(sidebar)` directory is a Next.js route group. Its layout wraps children with `<Sidebar />` + `<main>`. Pages outside the group (e.g. `/projects/[id]`) fall through to the root layout and render without the sidebar.

---

## Design System — Visual Tokens

### Border Radius (Roundings)

| Element | Token | Usage |
|---------|-------|-------|
| Cards | `rounded-2xl` | Project cards, collection rows |
| Modals | `rounded-2xl` | Create modal, confirm dialog, dropdown menus |
| Buttons (primary) | `rounded-xl` | "New Project", "Create", submit buttons |
| Buttons (secondary) | `rounded-xl` | Cancel, back, ghost buttons |
| Button icons (small) | `rounded-lg` | Sidebar toggle, three-dot menu trigger, modal close (X) |
| Inputs / textareas | `rounded-xl` | Form fields in modals |
| Select triggers | `rounded-xl` | Collection dropdown in create-project modal |
| Sidebar nav items | `rounded-lg` | Navigation links in sidebar |
| Sidebar search bar | `rounded-lg` | Search input wrapper |
| Layout toggle | `rounded-lg` (outer), `rounded-md` (inner buttons) | Grid/list switcher |
| Avatar / user circle | `rounded-full` | User avatar, team member dots |
| Color swatches (picker) | `rounded-lg` | 8×8 color squares in modals |
| Empty-state icons | `rounded-2xl` (outer box), `rounded-3xl` (large sticker) | Empty collection |

### Padding & Spacing

| Context | Token | Where |
|---------|-------|-------|
| Page header | `px-6 py-4` | Sticky top bar on every page |
| Page content area | `p-6` | Wrapper below the header |
| Card content | `p-4` | Text area below card thumbnail |
| Modal body | `p-5` | Form content inside modals |
| Modal header | `px-5 py-4` | Title bar with close button |
| Modal field spacing | `space-y-5` | Gap between form fields |
| Modal button row | `gap-3` (+ `pt-2`) | Cancel / Submit buttons |
| Sidebar nav | `px-2 py-2` | Nav container |
| Sidebar nav items | `px-3 py-2` | Each nav link |
| Sidebar search area | `px-3 pb-3` | Search bar wrapper |
| Sidebar user area | `px-3 py-3` | Bottom user section |
| Row item (list view) | `px-4 py-3` | Project rows |
| Dropdown menu items | `px-3.5 py-2` | Context menu buttons |
| Dropdown menu container | `py-1.5` | Top/bottom padding of menu |
| Small icon buttons | `p-1.5` | Toggle, close, three-dot buttons |
| Layout toggle container | `p-0.5` | Tiny inner padding in segmented control |
| Button (primary) | `px-4 py-2.5` | "New Project" header button |
| Confirm dialog | `p-6` | Dialog body |
| Card grid gap | `gap-4` | Grid of project cards |
| List row gap | `space-y-0.5` | List rows (very tight) |
| Header button gutter | `gap-3` | Between layout toggle and "New Project" button |

### Font Sizes

| Element | Token | Weight |
|---------|-------|--------|
| Page title (h1) | `text-lg` | `font-semibold` |
| Card title | `text-sm` | `font-medium` |
| Card description | `text-xs` | normal |
| Row title | `text-sm` | `font-medium` |
| Row description | `text-xs` | normal |
| Sidebar nav items | `text-sm` | normal (active: `font-medium`) |
| Modal title | `text-base` | `font-semibold` |
| Modal label | `text-sm` | `font-medium` |
| Modal input text | `text-sm` | normal |
| Dropdown menu items | `text-sm` | normal |
| Metadata / timestamp | `text-xs` | normal |
| User name (sidebar) | `text-sm` | `font-medium` |
| User email (sidebar) | `text-xs` | normal |
| Empty-state heading | `text-lg` | `font-medium` |
| Empty-state body | `text-sm` | normal |
| Button text | `text-sm` | `font-medium` |

### Icon Sizes

| Context | Size |
|---------|------|
| Page title icons | `w-4 h-4` |
| Sidebar nav icons | `w-4 h-4` |
| Sidebar toggle (PanelLeft) | `w-4 h-4` |
| Search icon | `w-4 h-4` |
| Layout toggle icons | `w-3.5 h-3.5` |
| Dropdown menu item icons | `w-3.5 h-3.5` |
| Dropdown submenu back arrow | `w-3.5 h-3.5` |
| Card timestamp clock | `w-3 h-3` |
| Row timestamp clock | `w-3 h-3` |
| Card three-dot trigger | `w-4 h-4` |
| Row three-dot trigger | `w-4 h-4` |
| Modal close (X) | `w-4 h-4` |
| Card more-actions | `w-4 h-4` |
| Collection folder icon (row) | `w-5 h-5` |
| Collection folder icon (detail header) | `w-4 h-4` |
| Empty-state icon (large) | `w-10 h-10` |
| Empty-state icon (small) | `w-8 h-8` |
| Confirm dialog alert | `w-5 h-5` |
| Checkmark in dropdown | `w-3.5 h-3.5` |
| User avatar | `w-8 h-8` |
| Team member dot | `w-5 h-5` |

### Colors — Semantic Map

| Role | Light Mode | Notes |
|------|-----------|-------|
| Page background | `#0c0c11` / `bg-[#0c0c11]` | Tailwind has no direct token, use literal |
| Sidebar background | `bg-zinc-950` | Darker than page |
| Card surface (rest) | `bg-white/[0.02]` | Very subtle |
| Card surface (hover) | `group-hover:bg-white/[0.04]` | |
| Input / select surface | `bg-white/[0.04]` | |
| Sidebar active nav | `bg-white/[0.08]` | |
| Sidebar hover nav | `hover:bg-white/[0.04]` | |
| Dropdown / modal surface | `bg-zinc-900` | Solid dark for menus |
| Border (rest) | `border-white/[0.06]` | Default subtle border |
| Border (hover) | `border-white/[0.12]` | Cards, rows on hover |
| Border (modal) | `border-white/[0.08]` | Slightly more visible |
| Text primary | `text-zinc-100` | Headings, active state |
| Text body | `text-zinc-200` | Card titles, nav items |
| Text secondary | `text-zinc-400` / `text-zinc-500` | Descriptions, metadata |
| Text muted | `text-zinc-600` | Empty state, placeholder |
| Accent (primary) | `bg-amber-500` / `text-amber-400` | Buttons, active indicators |
| Accent (hover) | `bg-amber-400` / `text-amber-400` | |
| Accent glow | `shadow-amber-500/20` | Button hover shadow |
| Danger (text) | `text-red-400` | Delete / remove actions |
| Danger (bg) | `bg-red-500` / `bg-red-500/10` | Danger buttons |
| Danger (border) | `border-red-500/20` | Clean trash button |
| Focus ring | `focus:border-amber-500/50` | Input focus |
| Separator line | `border-white/[0.06]` | Sidebar dividers, modal header |
| Backdrop | `bg-black/60 backdrop-blur-sm` | Modal overlay |
| Thumbnail grid pattern | `rgba(255,255,255,0.9)` dots, `opacity-[0.06]` | Card decorative overlay |

### Z-Index Scale

| Layer | Value |
|-------|-------|
| Page sticky header | `z-10` |
| Modal backdrops | `z-[9998]` |
| Modals, dropdowns, popups | `z-[9999]` |

### Transition Durations

| Context | Duration | Easing |
|---------|----------|--------|
| Sidebar width | `300ms` | `ease-in-out` |
| Card/row border & bg | `300ms` | (Tailwind default) |
| Button hover (simple) | `200ms` | (Tailwind default) |
| Input focus | `200ms` | (Tailwind default) |
| Sidebar content fade | `200ms` | (opacity, Tailwind default) |
| Layout toggle | `200ms` | (Tailwind default) |
| Modal open (framer) | `0.2s` | `easeOut` |
| Modal backdrop (framer) | `0.15s` | (default) |
| Dropdown menu (framer) | `0.15s` | (default) |
| Menu slide spring | `stiffness: 350, damping: 32` | Spring |
| Card entrance (framer) | `0.25s` | `[0.25, 0.46, 0.45, 0.94]` |
| Card entrance delay | `index * 0.03s` | Per-card stagger |
| Row entrance (framer) | `0.2s` | `easeOut` |
| Row entrance delay | `index * 0.03s` | Per-row stagger |
| Collection row delay | `index * 0.04s` | Slightly slower |

---

## Component Patterns

### Portal + AnimatePresence (modals, dropdowns)

Every modal and dropdown uses `createPortal` to `document.body` with this structure:

```tsx
{typeof window !== "undefined" && createPortal(
  <AnimatePresence>
    {open && (
      <>
        <motion.div  // invisible backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998]"
          onClick={close}
        />
        <motion.div  // visible content
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="fixed z-[9999] ..."
        >
          ...
        </motion.div>
      </>
    )}
  </AnimatePresence>,
  document.body
)}
```

### Click-Outside Dismiss

```tsx
useEffect(() => {
  if (!open) return;
  const handler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) close();
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [open]);
```

Buttons inside the menu stop propagation: `onClick={(e) => { e.stopPropagation(); handle(); }}`

### Card Click-Through

Cards and rows navigate to `/projects/[id]` on click. Menu buttons use `e.stopPropagation()` so the menu opens without triggering navigation.

### Dual-Level Menu (slide submenu)

The project context menu supports a submenu for "Add to Collection":
- A flex container with `overflow-hidden` on the outer parent
- Two `w-44 shrink-0` panels side by side
- `animate={{ x: active ? -176 : 0 }}` with spring physics to slide between them
- Back button resets to main menu; selecting a collection closes the whole popup

### Layout Toggle

`LayoutToggle` is a `"use client"` segmented control. State (`"grid" | "list"`) lives in the parent page. Grid renders `<ProjectCard>`, list renders `<ProjectRow>`.

### Form Patterns

- Required fields: no visual marker (just disabled submit if empty)
- Optional fields: labeled "Description (optional)" with muted styling
- Submit disabled via `disabled={!name.trim()}` with `disabled:bg-amber-500/30`
- All inputs: `outline-none`, no visible outline, focus uses border color
- `autoFocus` on the first input when modal opens

---

## Data Layer

`lib/mock-data.ts` exports:
- `projects: Project[]` — all projects with `collectionId` link
- `recentProjects: Project[]` — subset for landing page
- `trashProjects: Project[]` — muted zinc-gradient cards
- `collections: Collection[]` — { id, name, color }

The `Project` interface lives in `components/project-card.tsx` and is re-exported for use across pages.

---

## Conventions

- **Client boundary:** Any file using hooks, Framer Motion, or browser APIs needs `"use client"`. Server components use `params: Promise<{ id: string }>` and `await params`.
- **Conditional styles:** Use ternary inside template literals — no `clsx` or `cn` utility (not installed).
- **File naming:** `kebab-case` for components, route segments use `[param]` dynamic syntax.
- **Imports:** `@/` alias maps to project root (from `tsconfig.json`).
- **Button press feedback:** Add `active:scale-[0.98]` to all interactive buttons.
- **Thumbnail gradients:** Stored as Tailwind gradient classes in mock data (`"from-violet-600 via-purple-600 to-indigo-600"`), applied via template literal.
- **No config file:** Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` in CSS. No `tailwind.config.ts` exists.
- **Fonts:** Geist Sans + Geist Mono via `next/font/google`, passed as CSS variables to `<html>`.
- **Overflow control:** Sidebar uses `overflow-hidden` for collapsed content, cards use `overflow-hidden` for thumbnail clip, modals/portals use `overflow-hidden` for menu slide clipping.
