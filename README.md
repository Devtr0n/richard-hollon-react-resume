# Richard Hollon's personal website

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-%236E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)

![Richard Hollon Website](resume-screenshot.jpg?raw=true "Richard Hollon Website")

### [Live site &rarr; www.richardhollon.com](https://www.richardhollon.com/)

## Description
My personal resume/portfolio website, originally based on a forked ReactJS template by [Tim Baker](https://github.com/tbakerx/react-resume-template). It has since been modernized: migrated off Create React App onto [Vite](https://vite.dev/) + [Vitest](https://vitest.dev/), cleaned of dead/legacy code (jQuery AJAX, old analytics, CRA service worker), and set up with automated deployment to [GitHub Pages](https://pages.github.com/) on a custom domain.

## Tech Stack
| Concern                  | Tool                                             |
|--------------------------|---------------------------------------------------|
| UI framework             | React 17 (class components)                      |
| Build tool / dev server  | Vite 8                                           |
| Testing                  | Vitest + Testing Library                         |
| Hosting                  | GitHub Pages (custom domain, HTTPS)              |
| CI/CD                    | GitHub Actions (`.github/workflows/deploy.yml`)  |
| Styling                  | Hand-written CSS + Font Awesome                  |

## Development

Install dependencies:
```
npm install
```

Run the local dev server (Vite, hot-reloading) at `http://localhost:5173`:
```
npm run dev
```

Run the test suite (Vitest):
```
npm run test
```

Build a production bundle to `build/`:
```
npm run build
```

Preview the production build locally:
```
npm run preview
```

## Deployment

Deployment is automated: every push to `master` triggers a [GitHub Actions workflow](.github/workflows/deploy.yml) that builds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves at the custom domain configured below.

A manual deploy is also available if needed:
```
npm run deploy
```

### Custom domain / DNS
The site is served at `www.richardhollon.com` via GitHub Pages. This requires:
- A `CNAME` record for `www` pointing to `<github-username>.github.io`, and (optionally) `A` records for the bare domain pointing to GitHub Pages' IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
- A `public/CNAME` file containing `www.richardhollon.com` (copied into every build so the custom domain persists across deploys).
- GitHub repo Settings → Pages: Source = "Deploy from a branch" (`gh-pages` / root), with the custom domain configured and "Enforce HTTPS" enabled.

### Contact form
GitHub Pages only serves static files, so the contact form posts directly from the browser to [Formspree](https://formspree.io/) instead of a custom backend.
1. Create a free form at [formspree.io](https://formspree.io/) and copy its endpoint URL (e.g. `https://formspree.io/f/abcdwxyz`).
2. Set `VITE_FORMSPREE_ENDPOINT` to that URL:
   - Locally: copy `.env.example` to `.env.local` and fill it in.
   - In CI: add a repository secret named `VITE_FORMSPREE_ENDPOINT` (Settings → Secrets and variables → Actions) — the [deploy workflow](.github/workflows/deploy.yml) passes it into the build.

If the variable isn't set, the form shows an error asking the visitor to email directly instead of failing silently.

## Roadmap
- [ ] Consider migrating class components to function components/hooks
- [ ] Evaluate a full framework rewrite (see note below)

> **Considering a rewrite to Svelte?** It's a reasonable option long-term (smaller bundles, no virtual DOM, less boilerplate than class-based React), but it would mean rewriting every component and the resume-rendering logic from scratch — not a drop-in swap like the Vite migration was. For a small, mostly-static resume page, the ROI is modest; the current React 17 + Vite stack already builds fast and hosts cheaply. Worth it mainly if you want a learning project or plan to add more interactive features down the road.

## Credits
##### Udemy Course
<a href="https://www.udemy.com/projects-in-reactjs-the-complete-react-learning-course/learn/v4/overview">Projects in ReactJS: The Complete React Learning Course by Eduonix</a>

#### HTML Design Template
<a href="https://www.styleshout.com/free-templates/ceevee/">Ceevee Template by Styleshout</a>

##### Header photo credit
<a href="https://unsplash.com/@mischievous_penguins?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge">Casey Horner</a>

##### Original Author
[Tim Baker](https://github.com/tbakerx)
