========================================================================
ST. MARY'S SECONDARY SCHOOL WEB PORTAL
Standalone HTML, CSS, JS with PHP & Microsoft Access (*.accdb) Backend
========================================================================

WHY DID YOU GET A BLANK WHITE SCREEN PREVIOUSLY?
------------------------------------------------
If you previously opened the root "index.html" file from the main development
source code, that file contains:
  <script type="module" src="/src/main.tsx"></script>

Browsers (Chrome, Edge, Firefox) CANNOT execute TypeScript (.tsx) files directly
without a Node.js development server running. As a result, the browser displays
a completely blank white screen!

HOW TO TEST LOCALLY WITHOUT ANY ERRORS:
--------------------------------------

OPTION 1: FASTEST DIRECT BROWSER TEST (NO SERVER REQUIRED!)
Simply double-click "index.html" in this folder!
It will open directly in Google Chrome, Microsoft Edge, or Firefox.
All styling (style.css), images, client-side validation, demo data, and
navigation (Registration -> Login -> Student Dashboard -> Admin Dashboard)
work 100% out-of-the-box!

OPTION 2: RUNNING WITH PHP & XAMPP ON WINDOWS
1. Extract this entire folder to your XAMPP web directory:
   C:\xampp\htdocs\st_marys_secondary_school\

2. Open "php.ini" (via XAMPP Control Panel > Apache > Config > php.ini).
   Search for "pdo_odbc" and ensure the semicolon is removed:
     extension=pdo_odbc
     extension=odbc
   Save and restart Apache in XAMPP.

3. Create the Access Database:
   Open Microsoft Access -> Create a blank database named:
     C:\xampp\htdocs\st_marys_secondary_school\database\st_marys_school.accdb
   In Access, go to Create > Query Design > SQL View, paste the content of:
     database\schema_access.sql
   Click Run (!) to create the tables.

4. Open your browser to:
   http://localhost/st_marys_secondary_school/index.html
   or
   http://localhost/st_marys_secondary_school/

DEFAULT DEMO LOGINS:
- Administrator: admin@stmarys.ac.ke  /  Admin123
- Student:       kevin.otieno@student.stmarys.ac.ke  /  Password123
========================================================================
