# Kenchain Global Forces India Private Limited

A responsive corporate website and local demonstration dashboard built with HTML, CSS, Bootstrap 5 and vanilla JavaScript.

## Run locally

1. Open this folder in Visual Studio Code.
2. Install or enable the **Live Server** extension if it is not already available.
3. Right-click `index.html` and select **Open with Live Server**.

No build step, backend, database, API key or account is required. Bootstrap and the typefaces are loaded from CDNs; industry photography is loaded from Unsplash. Those visual assets require an internet connection. The site content, forms and demo data do not depend on a backend.

## Pages and features

The website is a single-page experience with Home, About Us, Our Divisions, division detail dialogs, Upcoming Projects, Careers and Contact sections. The footer's **Demo admin** link opens the local dashboard.

The admin demonstration login is:

- Username: `admin`
- Password: `kgfipl2026`

This is deliberately not secure authentication. It is only a front-end demonstration; credentials and data are visible to anyone using the browser.

## Browser data and privacy

Projects, enquiries, career applications and division edits use these LocalStorage keys:

- `KGFIPL_Projects`
- `KGFIPL_Enquiries`
- `KGFIPL_Careers`
- `KGFIPL_Divisions`

Data stays in the current browser and is not submitted to Kenchain or any server. Clearing browser site data removes these records. Project images must be no larger than 300 KB; optional resumes must be no larger than 250 KB. Small uploaded files are stored as data URLs in browser storage, which has limited capacity. Resume uploads are not transmitted, and applications submitted here are not delivered to the company.

## Project layout

```text
KGFIPL-Website/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/script.js
    ├── images/
    └── documents/
```
"# KGFIPL-Website" 
