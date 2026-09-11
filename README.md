# Richard Hollon's personal website
![Richard Hollon Website](resume-screenshot.jpg?raw=true "Richard Hollon Website")
### <a href="https://www.richardhollon.com/">A LIVE DEMO</a>

## Description
This is my current website using a forked ReactJS template created by [Tim Baker](https://github.com/tbakerx/react-resume-template). I customized the content, per instructions and documentation, to quickly produce my own personal website using a lightweight and modern web stack.

The site is built with [Vite](https://vite.dev/) and hosted on [GitHub Pages](https://pages.github.com/) with a custom domain.

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

## Credits
##### Udemy Course
<a href="https://www.udemy.com/projects-in-reactjs-the-complete-react-learning-course/learn/v4/overview">Projects in ReactJS: The Complete React Learning Course by Eduonix</a>

#### HTML Design Template
<a href="https://www.styleshout.com/free-templates/ceevee/">Ceevee Template by Styleshout</a>

##### Header photo credit
<a href="https://unsplash.com/@mischievous_penguins?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge">Casey Horner</a>

##### Original Author
[Tim Baker](https://github.com/tbakerx)


![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
