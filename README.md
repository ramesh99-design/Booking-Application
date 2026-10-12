# Booking Application

A passenger registration front-end built with React, Vite and Tailwind CSS.
No backend or database: data is kept in the browser's localStorage.

**Live demo:** https://book1ng-app.netlify.app/

![Booking Application screenshot](screenshot.png)

## Features
- Registration with first, middle and last name combined into one full name
- Country → State → District cascading dropdowns (India, all states and UTs)
- Automatic age calculation with Adult (18+) / Child (under 18) badge
- Admin/Staff registration with profile photo, Aadhaar and ID card PDF uploads (type and size validation)
- Passenger grid with Details, Update and Delete
- Search, pagination and Delete All
- Data persists across refreshes

## Notes
- Data is stored only in your own browser, so it isn't shared between devices or users.
- Uploaded files stay in your browser's storage and are never sent anywhere. Please don't upload real identity documents to the demo.
- Because browser storage is limited (about 5 MB), uploads are capped at 200 KB for the photo and 500 KB for each PDF.

## Run locally
```bash
npm install
npm run dev
```

## Tech
React, Vite, Tailwind CSS, localStorage

## Credits
State and district data from [KTBsomen/Indian-state-district-json](https://github.com/KTBsomen/Indian-state-district-json) (MIT licensed, sourced from igod.gov.in).
