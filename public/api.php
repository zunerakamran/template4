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
$SECRET_API_KEY = "YOUR_SECRET_KEY";

$DB_HOST = "localhost";
$DB_NAME = "YOUR_CPANEL_DB_NAME";
$DB_USER = "YOUR_CPANEL_DB_USER";
$DB_PASS = "YOUR_CPANEL_DB_PASS";

$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/content.json';
$seedFile = $dataDir . '/default-sections.json';

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
        'features' => 'Features Carousel',
        'featurescarousel' => 'Features Carousel',
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

function loadSeedSections() {
    global $seedFile;
    if (!file_exists($seedFile)) return [];
    $raw = json_decode(file_get_contents($seedFile), true);
    return is_array($raw) ? $raw : [];
}

function getPdoConnection($host, $name, $user, $pass) {
    if (empty($host) || empty($name) || empty($user) || $name === 'YOUR_CPANEL_DB_NAME' || $user === 'YOUR_CPANEL_DB_USER') {
        return null;
    }
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Exception $e) {
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
            `content` LONGTEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }

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
    $sql = "SELECT `{$nameCol}` AS name, `{$contentCol}` AS content";
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

function rowsToSections(array $rows) {
    $sections = [];
    $list = [];
    foreach ($rows as $row) {
        $name = canonicalSectionName($row['name'] ?? '');
        if ($name === '' || isset($sections[$name])) continue;
        $cnt = $row['content'] ?? null;
        if (is_string($cnt)) {
            $decoded = json_decode($cnt, true);
            $cnt = is_array($decoded) ? $decoded : $cnt;
        }
        $sections[$name] = $cnt;
        $list[] = ['name' => $name, 'content' => $cnt];
    }
    return [$sections, $list];
}

function upsertPublishedSection(PDO $pdo, $name, $content, $advisorId = null) {
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

    if ($hasAdvisor && $advisorId !== null && $advisorId !== '') {
        $find = $pdo->prepare("SELECT `id` FROM `sections` WHERE `{$nameCol}` = ? AND `advisor_id` = ? LIMIT 1");
        $find->execute([$name, $advisorId]);
        $id = $find->fetchColumn();
        if ($id) {
            $upd = $pdo->prepare("UPDATE `sections` SET `{$contentCol}` = ? WHERE `id` = ?");
            $upd->execute([$json, $id]);
            return;
        }
    } else {
        $find = $pdo->prepare("SELECT `id` FROM `sections` WHERE `{$nameCol}` = ? LIMIT 1");
        $find->execute([$name]);
        $id = $find->fetchColumn();
        if ($id) {
            $upd = $pdo->prepare("UPDATE `sections` SET `{$contentCol}` = ? WHERE `id` = ?");
            $upd->execute([$json, $id]);
            return;
        }
    }

    $fields = [$nameCol, $contentCol];
    $values = [$name, $json];
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

$pdo = getPdoConnection($DB_HOST, $DB_NAME, $DB_USER, $DB_PASS);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

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
                    if ($name && $content) {
                        upsertPublishedSection($pdo, $name, $content, $advisorId);
                        $updatedSectionsCount++;
                    }
                }
            }
        } catch (Exception $e) {
            $dbError = $e->getMessage();
        }
    }

    if (!file_exists($dataDir)) mkdir($dataDir, 0755, true);
    $existing = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];

    if (!empty($input['primary_color'])) $existing['primary_color'] = $input['primary_color'];
    if (!empty($input['secondary_color'])) $existing['secondary_color'] = $input['secondary_color'];
    if (!empty($input['logo_url'])) $existing['logo_url'] = $input['logo_url'];
    if (!isset($existing['sections']) || !is_array($existing['sections'])) $existing['sections'] = [];

    if (isset($input['sections']) && is_array($input['sections'])) {
        foreach ($input['sections'] as $newSec) {
            $name = $newSec['name'] ?? $newSec['section_name'] ?? null;
            $content = $newSec['content'] ?? null;
            if ($name && $content) {
                $parsed = is_string($content) ? (json_decode($content, true) ?: $content) : $content;
                $existing['sections'][canonicalSectionName($name)] = $parsed;
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
        $list = [];
        foreach ($fileData['sections'] as $secName => $secContent) {
            $name = canonicalSectionName($secName);
            $cnt = is_string($secContent) ? (json_decode($secContent, true) ?: $secContent) : $secContent;
            $result['sections'][$name] = $cnt;
            $list[] = ['name' => $name, 'content' => $cnt];
        }
        $result['sections_list'] = $list;
        $result['content_source'] = 'json_file';
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
