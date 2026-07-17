# A26 Project Backend

This backend uses PHP with MySQL and runs in XAMPP.

1. Start Apache and MySQL from XAMPP.
2. Import `backend/database.sql` in phpMyAdmin.
3. If needed, update database credentials in `backend/config.php`.
4. Open `backend/projects.php` in the browser and upload projects.
5. The website loads project data from `backend/api/projects.php`.

For a Laravel version, use the same `projects` table fields:
`project_name`, `image`, `main_image`, `sub_image`, `sort_order`, `is_active`.
