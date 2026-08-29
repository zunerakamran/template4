<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// --------------------------------------------------------------------------
// Advisor cPanel live site
// Fill these with THIS advisor's cPanel MySQL credentials (not the hub DB).
// --------------------------------------------------------------------------
$SECRET_API_KEY = "sec_epatronus_live_key_987654321";

// Advisor site MySQL on epatronus.space (not the hub at devznr.epatronus.net).
$DB_HOST = "localhost";
$DB_NAME = "epspace_compliance_template4_database";
$DB_USER = "epspace_compliance_template4_database_user";
$DB_PASS = "cd8jtxl3.JTi";

$manualConfigFile = __DIR__ . '/cpanel-config.php';
if (file_exists($manualConfigFile)) {
    $manual = include $manualConfigFile;
    if (is_array($manual)) {
        $DB_HOST = $manual['DB_HOST'] ?? $DB_HOST;
        $DB_NAME = $manual['DB_NAME'] ?? $DB_NAME;
        $DB_USER = $manual['DB_USER'] ?? $DB_USER;
        $DB_PASS = $manual['DB_PASS'] ?? $DB_PASS;
        $SECRET_API_KEY = $manual['SECRET_API_KEY'] ?? $SECRET_API_KEY;
    }
}

$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/content.json';
$seedFile = $dataDir . '/default-sections.json';
$dbConfigFile = $dataDir . '/cpanel-db.php';

function jsonBody($raw) {
    if (!$raw) return [];
    if (is_array($raw)) return $raw;
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function sectionKey($name) {
    return strtolower(preg_replace('/[^a-z0-9]/i', '', (string)$name));
}

function canonicalSectionName($name) {
    $map = [
        'header' => 'Header',
        'hero' => 'Hero Slider',
        'heroslider' => 'Hero Slider',
        'features' => 'What we do',
        'featurescarousel' => 'What we do',
        'whatwedo' => 'What we do',
        'about' => 'About Section',
        'aboutsection' => 'About Section',
        'aboutus' => 'About Section',
        'history' => 'Company History',
        'companyhistory' => 'Company History',
        'services' => 'Featured Services',
        'featuredservices' => 'Featured Services',
        'annual' => 'Annual Progression',
        'annualprogression' => 'Annual Progression',
        'progression' => 'Annual Progression',
        'portfolio' => 'Portfolio Section',
        'portfoliosection' => 'Portfolio Section',
        'branch' => 'Branches and Appointment',
        'branches' => 'Branches and Appointment',
        'appointment' => 'Branches and Appointment',
        'branchesandappointment' => 'Branches and Appointment',
        'stat' => 'Counter Stats',
        'stats' => 'Counter Stats',
        'counterstats' => 'Counter Stats',
        'testimonial' => 'Testimonials Carousel',
        'testimonials' => 'Testimonials Carousel',
        'testimonialscarousel' => 'Testimonials Carousel',
        'news' => 'Latest News',
        'latestnews' => 'Latest News',
        'logo' => 'Client Logos',
        'logos' => 'Client Logos',
        'clientlogos' => 'Client Logos',
        'cta' => 'CTA Banner',
        'banner' => 'CTA Banner',
        'ctabanner' => 'CTA Banner',
        'footer' => 'Footer',
    ];
    $key = sectionKey($name);
    return $map[$key] ?? trim((string)$name);
}

function tableExists(PDO $pdo, $table) {
    $stmt = $pdo->prepare('SHOW TABLES LIKE ?');
    $stmt->execute([$table]);
    return (bool)$stmt->fetch();
}

function columnMap(PDO $pdo, $table) {
    $cols = [];
    try {
        foreach ($pdo->query("SHOW COLUMNS FROM `{$table}`") as $row) {
            $cols[strtolower($row['Field'])] = $row['Field'];
        }
    } catch (Exception $e) {
        return [];
    }
    return $cols;
}

function ensureSectionMetaColumns(PDO $pdo) {
    $cols = columnMap($pdo, 'sections');
    if (!$cols) return;

    $nameCol = $cols['section_name'] ?? $cols['name'] ?? null;
    if (!isset($cols['display_name'])) {
        $after = $nameCol ? " AFTER `{$nameCol}`" : '';
        $pdo->exec("ALTER TABLE `sections` ADD COLUMN `display_name` VARCHAR(255) NULL{$after}");
    }
    if (!isset($cols['is_visible'])) {
        $pdo->exec('ALTER TABLE `sections` ADD COLUMN `is_visible` TINYINT(1) NOT NULL DEFAULT 1');
    }
}

function rowIsVisible(array $row) {
    if (!array_key_exists('is_visible', $row)) return true;
    $value = $row['is_visible'];
    return $value === true || $value === 1 || $value === '1';
}

function loadSeedSections() {
    global $seedFile;
    if (!file_exists($seedFile)) return [];
    $raw = json_decode(file_get_contents($seedFile), true);
    return is_array($raw) ? $raw : [];
}

function loadSavedDbConfig() {
    global $dbConfigFile;
    if (!file_exists($dbConfigFile)) return [];
    $cfg = include $dbConfigFile;
    return is_array($cfg) ? $cfg : [];
}

function persistDbConfig($cfg) {
    global $dataDir, $dbConfigFile;
    if (!file_exists($dataDir)) mkdir($dataDir, 0755, true);
    $export = var_export([
        'DB_HOST' => $cfg['DB_HOST'] ?? 'localhost',
        'DB_NAME' => $cfg['DB_NAME'] ?? '',
        'DB_USER' => $cfg['DB_USER'] ?? '',
        'DB_PASS' => $cfg['DB_PASS'] ?? '',
        'SECRET_API_KEY' => $cfg['SECRET_API_KEY'] ?? '',
    ], true);
    file_put_contents($dbConfigFile, "<?php\nreturn {$export};\n");
}

function isPlaceholderDb($name, $user) {
    return empty($name) || empty($user) || $name === 'YOUR_CPANEL_DB_NAME' || $user === 'YOUR_CPANEL_DB_USER';
}

function resolveDbConfig($input = null) {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $SECRET_API_KEY;
    $saved = loadSavedDbConfig();
    $cfg = [
        'DB_HOST' => $saved['DB_HOST'] ?? $DB_HOST,
        'DB_NAME' => $saved['DB_NAME'] ?? $DB_NAME,
        'DB_USER' => $saved['DB_USER'] ?? $DB_USER,
        'DB_PASS' => $saved['DB_PASS'] ?? $DB_PASS,
        'SECRET_API_KEY' => $saved['SECRET_API_KEY'] ?? $SECRET_API_KEY,
    ];
    if (is_array($input)) {
        $postName = $input['db_name'] ?? $input['cpanel_db_name'] ?? null;
        $postUser = $input['db_user'] ?? $input['cpanel_db_user'] ?? null;
        if ($postName && $postUser && !isPlaceholderDb($postName, $postUser)) {
            $cfg['DB_HOST'] = $input['db_host'] ?? $input['cpanel_db_host'] ?? 'localhost';
            $cfg['DB_NAME'] = $postName;
            $cfg['DB_USER'] = $postUser;
            $cfg['DB_PASS'] = $input['db_pass'] ?? $input['cpanel_db_pass'] ?? '';
            if (!empty($input['api_key'])) {
                $cfg['SECRET_API_KEY'] = $input['api_key'];
            }
        }
    }
    return $cfg;
}

$PDO_CONNECT_ERROR = null;

function getPdoConnection($host, $name, $user, $pass) {
    global $PDO_CONNECT_ERROR;
    $PDO_CONNECT_ERROR = null;
    if (isPlaceholderDb($name, $user)) {
        $PDO_CONNECT_ERROR = 'MySQL name/user are still placeholders. Create template4/cpanel-config.php on the advisor cPanel with this site\'s database credentials.';
        return null;
    }
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Exception $e) {
        $PDO_CONNECT_ERROR = $e->getMessage();
        return null;
    }

    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
            `setting_key` VARCHAR(100) PRIMARY KEY,
            `setting_value` TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    } catch (Exception $e) {
        // optional
    }

    if (!tableExists($pdo, 'sections')) {
        $pdo->exec("CREATE TABLE `sections` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `section_name` VARCHAR(255) NOT NULL UNIQUE,
            `display_name` VARCHAR(255) NULL,
            `is_visible` TINYINT(1) NOT NULL DEFAULT 1,
            `content` LONGTEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }

    ensureSectionMetaColumns($pdo);

    $cols = columnMap($pdo, 'sections');
    $nameCol = $cols['section_name'] ?? $cols['name'] ?? null;
    if ($nameCol && !isset($cols['page_id'])) {
        $count = (int)$pdo->query('SELECT COUNT(*) FROM `sections`')->fetchColumn();
        if ($count === 0) {
            $seed = loadSeedSections();
            if ($seed) {
                $stmt = $pdo->prepare("INSERT INTO `sections` (`{$nameCol}`, `content`) VALUES (?, ?)");
                foreach ($seed as $sName => $sContent) {
                    $stmt->execute([
                        canonicalSectionName($sName),
                        json_encode($sContent, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    ]);
                }
            }
        }
    }

    return $pdo;
}

function fetchSectionRows(PDO $pdo, $advisorId = null) {
    $cols = columnMap($pdo, 'sections');
    if (!$cols) return [];

    $nameCol = $cols['section_name'] ?? $cols['name'] ?? null;
    $contentCol = $cols['content'] ?? null;
    if (!$nameCol || !$contentCol) return [];

    $hasAdvisor = isset($cols['advisor_id']);
    $hasDisplayName = isset($cols['display_name']);
    $hasVisible = isset($cols['is_visible']);
    $sql = "SELECT `{$nameCol}` AS name, `{$contentCol}` AS content";
    if ($hasDisplayName) {
        $sql .= ', `display_name`';
    }
    if ($hasVisible) {
        $sql .= ', `is_visible`';
    }
    if ($hasAdvisor) {
        $sql .= ', `advisor_id`';
    }
    $sql .= ' FROM `sections`';

    $params = [];
    if ($hasAdvisor && $advisorId !== null && $advisorId !== '') {
        $sql .= ' WHERE (`advisor_id` = ? OR `advisor_id` IS NULL)';
        $params[] = $advisorId;
    }

    if ($hasAdvisor) {
        $sql .= ' ORDER BY (`advisor_id` IS NULL) ASC, `id` ASC';
    } else {
        $sql .= ' ORDER BY `id` ASC';
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll() ?: [];
}

function decodeSectionContent($cnt) {
    if (is_string($cnt)) {
        $decoded = json_decode($cnt, true);
        return is_array($decoded) ? $decoded : $cnt;
    }
    return $cnt;
}

function sectionContentRank($cnt) {
    if (!is_array($cnt)) return 0;
    $rank = count($cnt);
    if (!empty($cnt['boxes']) && is_array($cnt['boxes'])) {
        $rank += 50 + count($cnt['boxes']);
    }
    if (!empty($cnt['slides']) && is_array($cnt['slides'])) {
        $rank += 50 + count($cnt['slides']);
    }
    return $rank;
}

function rowsToSections(array $rows) {
    $sections = [];
    $listIndex = [];
    $list = [];
    foreach ($rows as $row) {
        $name = canonicalSectionName($row['name'] ?? '');
        if ($name === '') continue;

        $visible = rowIsVisible($row);
        $cnt = decodeSectionContent($row['content'] ?? null);
        $label = !empty($row['display_name']) ? $row['display_name'] : $name;

        if (!isset($listIndex[$name])) {
            $listIndex[$name] = count($list);
            $list[] = [
                'name'         => $name,
                'display_name' => $label,
                'is_visible'   => $visible,
                'content'      => $visible ? $cnt : null,
            ];
        } else {
            $list[$listIndex[$name]]['display_name'] = $label;
            $list[$listIndex[$name]]['is_visible'] = $visible;
            if ($visible) {
                $list[$listIndex[$name]]['content'] = $cnt;
            }
        }

        if (!$visible) {
            continue;
        }

        if (!isset($sections[$name])) {
            $sections[$name] = $cnt;
            continue;
        }
        if (sectionContentRank($cnt) > sectionContentRank($sections[$name])) {
            $sections[$name] = $cnt;
            $list[$listIndex[$name]]['content'] = $cnt;
        }
    }
    return [$sections, $list];
}

function upsertPublishedSection(PDO $pdo, $name, $content, $advisorId = null, $displayName = null, $isVisible = true) {
    $cols = columnMap($pdo, 'sections');
    $nameCol = $cols['section_name'] ?? $cols['name'] ?? null;
    $contentCol = $cols['content'] ?? null;
    if (!$nameCol || !$contentCol) {
        throw new Exception('sections table is missing name/content columns');
    }

    $name = canonicalSectionName($name);
    $json = is_string($content) ? $content : json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $hasAdvisor = isset($cols['advisor_id']);
    $hasPage = isset($cols['page_id']);
    $hasId = isset($cols['id']);
    $hasDisplayName = isset($cols['display_name']);
    $hasVisible = isset($cols['is_visible']);
    $visibleValue = $isVisible ? 1 : 0;

    $updated = 0;
    if ($hasId) {
        $select = "SELECT `id`, `{$nameCol}` AS name";
        if ($hasAdvisor) {
            $select .= ', `advisor_id`';
        }
        $select .= ' FROM `sections`';
        $existing = $pdo->query($select)->fetchAll() ?: [];

        $setParts = ["`{$contentCol}` = ?", "`{$nameCol}` = ?"];
        $setValues = [$json, $name];
        if ($hasDisplayName) {
            $setParts[] = '`display_name` = ?';
            $setValues[] = $displayName ?: null;
        }
        if ($hasVisible) {
            $setParts[] = '`is_visible` = ?';
            $setValues[] = $visibleValue;
        }
        $upd = $pdo->prepare('UPDATE `sections` SET ' . implode(', ', $setParts) . ' WHERE `id` = ?');

        foreach ($existing as $row) {
            if (canonicalSectionName($row['name'] ?? '') !== $name) {
                continue;
            }
            if ($hasAdvisor && $advisorId !== null && $advisorId !== '') {
                $rowAdvisor = $row['advisor_id'] ?? null;
                if ($rowAdvisor !== null && (string)$rowAdvisor !== (string)$advisorId) {
                    continue;
                }
            }
            $upd->execute(array_merge($setValues, [$row['id']]));
            $updated++;
        }
        if ($updated > 0) {
            return;
        }
    } else {
        $find = $pdo->prepare("SELECT `{$nameCol}` FROM `sections` WHERE `{$nameCol}` = ? LIMIT 1");
        $find->execute([$name]);
        if ($find->fetchColumn()) {
            $setParts = ["`{$contentCol}` = ?"];
            $setValues = [$json];
            if ($hasDisplayName) {
                $setParts[] = '`display_name` = ?';
                $setValues[] = $displayName ?: null;
            }
            if ($hasVisible) {
                $setParts[] = '`is_visible` = ?';
                $setValues[] = $visibleValue;
            }
            $upd = $pdo->prepare('UPDATE `sections` SET ' . implode(', ', $setParts) . " WHERE `{$nameCol}` = ?");
            $setValues[] = $name;
            $upd->execute($setValues);
            return;
        }
    }

    $fields = [$nameCol, $contentCol];
    $values = [$name, $json];
    if ($hasDisplayName) {
        $fields[] = 'display_name';
        $values[] = $displayName ?: null;
    }
    if ($hasVisible) {
        $fields[] = 'is_visible';
        $values[] = $visibleValue;
    }
    if ($hasAdvisor && $advisorId !== null && $advisorId !== '') {
        $fields[] = 'advisor_id';
        $values[] = $advisorId;
    }
    if ($hasPage) {
        $pageId = 1;
        try {
            $pageId = $pdo->query("SELECT `id` FROM `pages` WHERE `slug` = 'home' LIMIT 1")->fetchColumn() ?: $pageId;
        } catch (Exception $e) {
            // pages table may not exist on a dedicated live DB
        }
        $fields[] = 'page_id';
        $values[] = $pageId;
    }

    $placeholders = implode(', ', array_fill(0, count($fields), '?'));
    $fieldSql = '`' . implode('`, `', $fields) . '`';
    $ins = $pdo->prepare("INSERT INTO `sections` ({$fieldSql}) VALUES ({$placeholders})");
    $ins->execute($values);
}

function updateSectionMetaOnly(PDO $pdo, $name, $displayName = null, $isVisible = true, $advisorId = null) {
    $cols = columnMap($pdo, 'sections');
    $nameCol = $cols['section_name'] ?? $cols['name'] ?? null;
    if (!$nameCol) {
        throw new Exception('sections table is missing name column');
    }

    $name = canonicalSectionName($name);
    $hasAdvisor = isset($cols['advisor_id']);
    $hasDisplayName = isset($cols['display_name']);
    $hasVisible = isset($cols['is_visible']);
    $hasId = isset($cols['id']);

    $setParts = [];
    $setValues = [];
    if ($hasDisplayName) {
        $setParts[] = '`display_name` = ?';
        $setValues[] = $displayName ?: null;
    }
    if ($hasVisible) {
        $setParts[] = '`is_visible` = ?';
        $setValues[] = $isVisible ? 1 : 0;
    }
    if (!$setParts) {
        return;
    }

    if ($hasId) {
        $select = "SELECT `id`, `{$nameCol}` AS name";
        if ($hasAdvisor) {
            $select .= ', `advisor_id`';
        }
        $select .= ' FROM `sections`';
        $existing = $pdo->query($select)->fetchAll() ?: [];
        $upd = $pdo->prepare('UPDATE `sections` SET ' . implode(', ', $setParts) . ' WHERE `id` = ?');

        foreach ($existing as $row) {
            if (canonicalSectionName($row['name'] ?? '') !== $name) {
                continue;
            }
            if ($hasAdvisor && $advisorId !== null && $advisorId !== '') {
                $rowAdvisor = $row['advisor_id'] ?? null;
                if ($rowAdvisor !== null && (string)$rowAdvisor !== (string)$advisorId) {
                    continue;
                }
            }
            $upd->execute(array_merge($setValues, [$row['id']]));
        }
        return;
    }

    $upd = $pdo->prepare('UPDATE `sections` SET ' . implode(', ', $setParts) . " WHERE `{$nameCol}` = ?");
    $setValues[] = $name;
    $upd->execute($setValues);
}

$rawInput = file_get_contents('php://input');
$input = $_SERVER['REQUEST_METHOD'] === 'POST' ? (json_decode($rawInput, true) ?: []) : [];
$dbCfg = resolveDbConfig($_SERVER['REQUEST_METHOD'] === 'POST' ? $input : null);
if (!empty($dbCfg['SECRET_API_KEY'])) {
    $SECRET_API_KEY = $dbCfg['SECRET_API_KEY'];
}
$pdo = getPdoConnection($dbCfg['DB_HOST'], $dbCfg['DB_NAME'], $dbCfg['DB_USER'], $dbCfg['DB_PASS']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
        exit;
    }

    if (!empty($SECRET_API_KEY) && $SECRET_API_KEY !== 'YOUR_SECRET_KEY') {
        $providedKey = $input['api_key']
            ?? $_SERVER['HTTP_X_API_KEY']
            ?? null;

        if (!$providedKey && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
                $providedKey = $matches[1];
            }
        }

        if ($providedKey !== $SECRET_API_KEY) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Unauthorized: Invalid API Key.',
            ]);
            exit;
        }
    }

    $updatedSectionsCount = 0;
    $advisorId = $input['advisor_id'] ?? ($_GET['advisor_id'] ?? null);
    $dbError = null;

    if ($pdo) {
        try {
            if (!empty($input['primary_color'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_settings (setting_key, setting_value) VALUES ('primary_color', ?)");
                $stmt->execute([$input['primary_color']]);
            }
            if (!empty($input['secondary_color'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_settings (setting_key, setting_value) VALUES ('secondary_color', ?)");
                $stmt->execute([$input['secondary_color']]);
            }
            if (!empty($input['logo_url'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_settings (setting_key, setting_value) VALUES ('logo_url', ?)");
                $stmt->execute([$input['logo_url']]);
            }

            if (isset($input['sections']) && is_array($input['sections'])) {
                foreach ($input['sections'] as $newSec) {
                    $name = $newSec['name'] ?? $newSec['section_name'] ?? null;
                    $content = $newSec['content'] ?? null;
                    $displayName = $newSec['display_name'] ?? null;
                    $isVisible = array_key_exists('is_visible', $newSec) ? (bool)$newSec['is_visible'] : true;
                    if (!$name) {
                        continue;
                    }
                    if ($content !== null && $content !== '') {
                        upsertPublishedSection($pdo, $name, $content, $advisorId, $displayName, $isVisible);
                        $updatedSectionsCount++;
                    } elseif (array_key_exists('is_visible', $newSec) || $displayName !== null) {
                        updateSectionMetaOnly($pdo, $name, $displayName, $isVisible, $advisorId);
                        $updatedSectionsCount++;
                    }
                }
            }
        } catch (Exception $e) {
            $dbError = $e->getMessage();
        }
    } else {
        $dbError = 'Advisor cPanel MySQL is not connected. Fill DB name/user in the Power Admin deploy form (this site\'s database, not the central hub).';
    }

    if ($pdo && !$dbError && !isPlaceholderDb($dbCfg['DB_NAME'], $dbCfg['DB_USER'])) {
        persistDbConfig($dbCfg);
    }

    if (!file_exists($dataDir)) mkdir($dataDir, 0755, true);
    $existing = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];

    if (!empty($input['primary_color'])) $existing['primary_color'] = $input['primary_color'];
    if (!empty($input['secondary_color'])) $existing['secondary_color'] = $input['secondary_color'];
    if (!empty($input['logo_url'])) $existing['logo_url'] = $input['logo_url'];
    if (!isset($existing['sections']) || !is_array($existing['sections'])) $existing['sections'] = [];

    if (isset($input['sections']) && is_array($input['sections'])) {
        if (!isset($existing['sections_meta']) || !is_array($existing['sections_meta'])) {
            $existing['sections_meta'] = [];
        }
        foreach ($input['sections'] as $newSec) {
            $name = $newSec['name'] ?? $newSec['section_name'] ?? null;
            $content = $newSec['content'] ?? null;
            $displayName = $newSec['display_name'] ?? null;
            $isVisible = array_key_exists('is_visible', $newSec) ? (bool)$newSec['is_visible'] : true;
            if ($name && $content !== null && $content !== '') {
                $parsed = is_string($content) ? (json_decode($content, true) ?: $content) : $content;
                $canonical = canonicalSectionName($name);
                if ($isVisible) {
                    $existing['sections'][$canonical] = $parsed;
                } else {
                    unset($existing['sections'][$canonical]);
                }
                $existing['sections_meta'][$canonical] = [
                    'display_name' => $displayName ?: $canonical,
                    'is_visible'   => $isVisible,
                ];
                if (!$pdo) $updatedSectionsCount++;
            }
        }
    }

    file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

    http_response_code($dbError ? 500 : 200);
    echo json_encode([
        'status' => $dbError ? 'error' : 'success',
        'message' => $dbError
            ? ('Failed writing published content to advisor cPanel sections table: ' . $dbError)
            : 'Published content saved to advisor cPanel sections table',
        'db_active' => (bool)$pdo,
        'updated_count' => $updatedSectionsCount,
        'data' => $existing,
    ]);
    exit;
}

$result = [
    'primary_color' => '#0B1B3D',
    'secondary_color' => '#C8102E',
    'logo_url' => '/assets/intime/logo-dark.png',
    'sections' => [],
    'sections_list' => [],
    'content_source' => 'empty',
    'db_connected' => (bool)$pdo,
    'db_name' => (!empty($dbCfg['DB_NAME']) && !isPlaceholderDb($dbCfg['DB_NAME'], $dbCfg['DB_USER'] ?? '')) ? $dbCfg['DB_NAME'] : null,
    'db_error' => $PDO_CONNECT_ERROR,
];

$advisorId = $_GET['advisor_id'] ?? null;

if ($pdo) {
    try {
        $settingsStmt = $pdo->query('SELECT setting_key, setting_value FROM site_settings');
        while ($row = $settingsStmt->fetch()) {
            $result[$row['setting_key']] = $row['setting_value'];
        }
    } catch (Exception $e) {
        // site_settings is optional
    }

    try {
        $rows = fetchSectionRows($pdo, $advisorId);
        [$result['sections'], $result['sections_list']] = rowsToSections($rows);
        if (!empty($result['sections'])) {
            $result['content_source'] = 'cpanel_sections';
        }
    } catch (Exception $e) {
        $result['db_error'] = $e->getMessage();
    }
}

if (empty($result['sections']) && file_exists($dataFile)) {
    $fileData = json_decode(file_get_contents($dataFile), true) ?: [];
    if (!empty($fileData['primary_color'])) $result['primary_color'] = $fileData['primary_color'];
    if (!empty($fileData['secondary_color'])) $result['secondary_color'] = $fileData['secondary_color'];
    if (!empty($fileData['logo_url'])) $result['logo_url'] = $fileData['logo_url'];

    if (isset($fileData['sections']) && is_array($fileData['sections'])) {
        $meta = isset($fileData['sections_meta']) && is_array($fileData['sections_meta'])
            ? $fileData['sections_meta']
            : [];
        $list = [];
        foreach ($fileData['sections'] as $secName => $secContent) {
            $name = canonicalSectionName($secName);
            $sectionMeta = $meta[$name] ?? [];
            $isVisible = !array_key_exists('is_visible', $sectionMeta) || (bool)$sectionMeta['is_visible'];
            if (!$isVisible) {
                continue;
            }
            $cnt = is_string($secContent) ? (json_decode($secContent, true) ?: $secContent) : $secContent;
            $result['sections'][$name] = $cnt;
            $list[] = [
                'name'         => $name,
                'display_name' => $sectionMeta['display_name'] ?? $name,
                'is_visible'   => true,
                'content'      => $cnt,
            ];
        }
        $result['sections_list'] = $list;
        $result['content_source'] = 'json_file';
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
