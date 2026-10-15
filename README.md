# Spandan — Smart City Dashboard 🏙️

A multilingual civic engagement platform for Indian metros, built for the Smart City competition.

**Live demo:** https://YOUR-USERNAME.github.io/spandan-smart-city/

## Features

- 🌐 **Multilingual** — Hindi / English / Tamil / Bengali
- 🏠 **Home** — community feed, upvotes, time-bound comments, issue reporting
- 🚌 **Travel** — live bus/metro status, garbage van schedule
- ♻️ **Waste & Power** — collection calendar, electricity usage charts
- 📋 **Report** — file civic complaints with photo & location
- 🔮 **Future City** — vote on city proposals, AI-generated smart city plan
- 👮 **Nagar Nigam Officer Portal** — resolve/remove complaints (ID: `nigam`, PIN: `1234`)
- 🤖 **AI Assistant** — ask anything about city services
- 🌙 **Dark / Light mode**, mobile-first responsive design

## How to run locally

Just open `index.html` in any browser — no build step, no server needed.

## How to deploy

### GitHub Pages
1. Push this repo to GitHub
2. Settings → Pages → Branch: `main`, folder: `/`
3. Done — live at `https://USERNAME.github.io/REPO/`

### Netlify Drop
Drag the `index.html` + `favicon.svg` onto [netlify.com/drop](https://netlify.com/drop)

## Source structure

| File | Contents |
|------|----------|
| `src/a-head.html` | HTML head, meta tags |
| `src/b-css.html` | All CSS — tokens, dark mode, components |
| `src/c-body.html` | HTML shell & page skeletons |
| `src/d-core.js` | Router, i18n, theme, events |
| `src/e-data.js` | Simulated city data |
| `src/f-charts.js` | SVG chart renderers |
| `src/g0-shell.js` | Nav, toast, modal helpers |
| `src/g-welcome.js` | Onboarding / city-select flow |
| `src/h-home.js` | Home feed & comments |
| `src/i-travel-waste.js` | Travel & Waste/Power pages |
| `src/j-report.js` | Report issue page |
| `src/k-future-mgr.js` | Future City & Officer portal |
| `src/l-bot-boot.js` | AI bot |
| `src/m-tail.html` | Script assembly footer |
| `index.html` | **Single-file production build** (all parts concatenated) |

## Tech

Vanilla HTML · CSS · JavaScript — zero dependencies, zero build tools.

---
Built with ❤️ for Swachh Bharat Smart City Initiative
