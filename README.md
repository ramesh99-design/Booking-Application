# Booking Application

A passenger registration front-end built with React, Vite and Tailwind CSS. No backend or database: data is kept in the browser's localStorage.

## Features
- Registration with first, middle and last name combined into one full name
- Country → State → District cascading dropdowns (India, all states and UTs)
- Automatic age calculation with Adult (18+) / Child (under 18) badge
- Admin/Staff registration with profile photo, Aadhaar and ID card PDF uploads (type and size validation)
- Passenger grid with Details, Update and Delete
- Search, pagination and Delete All
- Data persists across refreshes

## Run locally
npm install
npm run dev

## Tech
React, Vite, Tailwind CSS, localStorage

## Credits
State and district data from [KTBsomen/Indian-state-district-json](https://github.com/KTBsomen/Indian-state-district-json) (MIT licensed, sourced from igod.gov.in).