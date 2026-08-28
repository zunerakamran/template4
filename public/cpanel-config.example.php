<?php
// Copy this file to cpanel-config.php on the ADVISOR cPanel
// (next to api.php, e.g. /template4/cpanel-config.php).
// Do not use the central hub database from devznr.epatronus.net.
// Values: epatronus.space → cPanel → MySQL Databases.

return [
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'epspace_compliance_template4_database',
    'DB_USER' => 'epspace_compliance_template4_database_user',
    'DB_PASS' => 'cd8jtxl3.JTi',
    'SECRET_API_KEY' => 'sec_epatronus_live_key_987654321',
    // Do not set a hub URL. Live pages must read this cPanel database only.
];
