import { calcAge, ageCategory } from "../Utils/age.js";

const avatar = (initials) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
       <rect width='96' height='96' fill='#6366f1'/>
       <text x='48' y='58' font-size='34' text-anchor='middle' fill='white' font-family='Arial'>${initials}</text>
     </svg>`
  );

// a tiny blank one-page PDF so the "View PDF" buttons have something to open
const pdf =
  "data:application/pdf;base64," +
  btoa(
    "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
      "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]>>endobj\n" +
      "trailer<</Root 1 0 R>>\n%%EOF"
  );

const rows = [
  ["Arun", "Kumar", "Selvam", "1998-03-14", "12, Gandhi Street, T. Nagar", "India", "Tamil Nadu", "Chennai", "Admin"],
  ["Priya", "", "Raman", "2001-11-02", "45, Lake View Road, Vijayanagar", "India", "Karnataka", "Mysore", "Staff"],
  ["Mohammed", "Irfan", "Khan", "1985-07-21", "7, MG Road, Camp Area", "India", "Maharashtra", "Pune", "Admin"],
  ["Ananya", "Sharma", "Iyer", "2012-05-09", "23, Temple Street, Anna Nagar", "India", "Tamil Nadu", "Madurai", "Staff"],
  ["Rohan", "", "Patil", "2009-12-30", "88, Civil Lines, Sitabuldi", "India", "Maharashtra", "Nagpur", "Admin"],
  ["Kavya", "Lakshmi", "Narayanan", "1995-01-25", "18, Race Course Road, RS Puram", "India", "Tamil Nadu", "Coimbatore", "Staff"],
  ["Vikram", "Singh", "Rathore", "1990-09-08", "56, Residency Road, Shanthinagar", "India", "Karnataka", "Bangalore", "Admin"],
  ["Sneha", "Anil", "Deshmukh", "2003-10-11", "9, Linking Road, Bandra West", "India", "Maharashtra", "Mumbai", "Staff"],
  ["Karthik", "", "Murugan", "2008-10-12", "31, Beach Road, Besant Nagar", "India", "Tamil Nadu", "Chennai", "Admin"],
  ["Emily", "Rose", "Carter", "1992-04-17", "220, Sunset Blvd, Hollywood", "USA", "California", "Los Angeles", "Staff"],
];

export const samplePassengers = rows.map(
  ([firstName, middleName, lastName, dob, address, country, state, district, role], i) => {
    const age = calcAge(dob);
    const base = firstName.toLowerCase();
    return {
      id: i + 1,
      fullName: [firstName, middleName, lastName].filter(Boolean).join(" "),
      firstName, middleName, lastName, dob, address, role,
      age,
      category: ageCategory(age),
      country, state, district,
      files: {
        photo: { name: `${base}.png`, size: 2048, url: avatar(firstName[0] + lastName[0]) },
        aadhaarPdf: { name: `${base}-aadhaar.pdf`, size: 300, url: pdf },
        idPdf: { name: `${base}-id.pdf`, size: 300, url: pdf },
      },
    };
  }
);