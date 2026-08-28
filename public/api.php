<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// --------------------------------------------------------------------------
// CONFIGURATION
// 1. Secret API Key: Set to match cpanel_api_key in Laravel Dashboard.
// 2. MySQL Database Settings: Fill with your cPanel MySQL DB credentials.
// --------------------------------------------------------------------------
$SECRET_API_KEY = "YOUR_SECRET_KEY";

$DB_HOST = "localhost";
$DB_NAME = "YOUR_CPANEL_DB_NAME";     // e.g. epatronu_template4
$DB_USER = "YOUR_CPANEL_DB_USER";     // e.g. epatronu_user
$DB_PASS = "YOUR_CPANEL_DB_PASS";     // e.g. your_db_password

// File fallback path
$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/content.json';

// Helper: Establish PDO MySQL Connection & Auto-Create Tables with Initial Seeding
function getPdoConnection($host, $name, $user, $pass) {
    if (empty($host) || empty($name) || empty($user) || $host === "YOUR_DB_HOST" || $name === "YOUR_CPANEL_DB_NAME") return null;
    try {
        $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Auto-create sections table in cPanel MySQL DB
        $pdo->exec("CREATE TABLE IF NOT EXISTS `sections` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `section_name` VARCHAR(255) NOT NULL UNIQUE,
            `content` LONGTEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Auto-create site_settings table in cPanel MySQL DB
        $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
            `setting_key` VARCHAR(100) PRIMARY KEY,
            `setting_value` TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Auto-seed default 13 sections matching dashboard if table is empty
        // Also migrate old hero slider structure to new slides structure
        $count = $pdo->query("SELECT COUNT(*) FROM `sections`")->fetchColumn();
        
        // Force update Hero Slider to new slides structure
        $heroSliderStmt = $pdo->prepare("SELECT content FROM sections WHERE section_name = 'Hero Slider'");
        $heroSliderStmt->execute();
        $heroSliderContent = $heroSliderStmt->fetchColumn();
        
        $newHeroSlider = [
            'slides' => [
                [
                    'id' => 1,
                    'bg' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
                    'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                    'heading' => 'Strategic Advisory for Long-Term Growth',
                    'subheading' => 'Customized financial planning, investment strategies, and fiduciary advice for leaders and families.',
                    'text' => 'We partner with you to navigate complex economic landscapes with confidence.',
                    'button_text' => 'GET IN TOUCH',
                    'button_url' => '#appointment',
                    'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                ],
                [
                    'id' => 2,
                    'bg' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80',
                    'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                    'heading' => 'We do the best thing for market funding',
                    'subheading' => 'High-impact financial solutions: institutional-grade portfolio management and risk mitigation strategies.',
                    'text' => 'Our team delivers proven results through disciplined investment approaches.',
                    'button_text' => 'GET IN TOUCH',
                    'button_url' => '#appointment',
                    'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                ],
                [
                    'id' => 3,
                    'bg' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
                    'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                    'heading' => 'We have to do business for your satisfaction',
                    'subheading' => 'Building lasting relationships through transparent communication and exceptional service.',
                    'text' => 'Your financial success is our primary mission and commitment.',
                    'button_text' => 'GET IN TOUCH',
                    'button_url' => '#appointment',
                    'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                ]
            ]
        ];
        
        if ($heroSliderContent) {
            $decoded = json_decode($heroSliderContent, true);
            // Check if it has old structure (no 'slides' key but has direct fields)
            if (is_array($decoded) && !isset($decoded['slides']) && (isset($decoded['heading']) || isset($decoded['eyebrow']))) {
                // Migrate old structure to new slides structure, preserving old content in slide 1
                $newHeroSlider['slides'][0]['bg'] = $decoded['image_url'] ?? $newHeroSlider['slides'][0]['bg'];
                $newHeroSlider['slides'][0]['eyebrow'] = $decoded['eyebrow'] ?? $newHeroSlider['slides'][0]['eyebrow'];
                $newHeroSlider['slides'][0]['heading'] = $decoded['heading'] ?? $newHeroSlider['slides'][0]['heading'];
                $newHeroSlider['slides'][0]['subheading'] = $decoded['subheading'] ?? $newHeroSlider['slides'][0]['subheading'];
                $newHeroSlider['slides'][0]['text'] = $decoded['text'] ?? $newHeroSlider['slides'][0]['text'];
                $newHeroSlider['slides'][0]['button_text'] = $decoded['button_text'] ?? $newHeroSlider['slides'][0]['button_text'];
                $newHeroSlider['slides'][0]['button_url'] = $decoded['button_url'] ?? $newHeroSlider['slides'][0]['button_url'];
                
                $updateStmt = $pdo->prepare("UPDATE sections SET content = ? WHERE section_name = 'Hero Slider'");
                $updateStmt->execute([json_encode($newHeroSlider, JSON_UNESCAPED_UNICODE)]);
            } elseif (!isset($decoded['slides']) || !is_array($decoded['slides']) || count($decoded['slides']) < 3) {
                // Force update if structure is incorrect or missing slides
                $updateStmt = $pdo->prepare("UPDATE sections SET content = ? WHERE section_name = 'Hero Slider'");
                $updateStmt->execute([json_encode($newHeroSlider, JSON_UNESCAPED_UNICODE)]);
            }
        }
        
        if ($count == 0) {
            $defaultSections = [
                'Hero Slider' => [
                    'slides' => [
                        [
                            'id' => 1,
                            'bg' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
                            'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                            'heading' => 'Strategic Advisory for Long-Term Growth',
                            'subheading' => 'Customized financial planning, investment strategies, and fiduciary advice for leaders and families.',
                            'text' => 'We partner with you to navigate complex economic landscapes with confidence.',
                            'button_text' => 'GET IN TOUCH',
                            'button_url' => '#appointment',
                            'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                        ],
                        [
                            'id' => 2,
                            'bg' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80',
                            'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                            'heading' => 'We do the best thing for market funding',
                            'subheading' => 'High-impact financial solutions: institutional-grade portfolio management and risk mitigation strategies.',
                            'text' => 'Our team delivers proven results through disciplined investment approaches.',
                            'button_text' => 'GET IN TOUCH',
                            'button_url' => '#appointment',
                            'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                        ],
                        [
                            'id' => 3,
                            'bg' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
                            'eyebrow' => 'FINANCIAL CENTRE & WEALTH MANAGEMENT',
                            'heading' => 'We have to do business for your satisfaction',
                            'subheading' => 'Building lasting relationships through transparent communication and exceptional service.',
                            'text' => 'Your financial success is our primary mission and commitment.',
                            'button_text' => 'GET IN TOUCH',
                            'button_url' => '#appointment',
                            'youtube_url' => 'https://www.youtube.com/watch?v=SF4aHwxHtZ0'
                        ]
                    ]
                ],
                'Features Carousel' => [
                    'eyebrow'    => 'WHAT WE DO',
                    'heading'    => 'We are the best agency to improve your deals.',
                    'subheading' => 'High-impact financial solutions: institutional-grade portfolio management and risk mitigation strategies.'
                ],
                'About Section' => [
                    'eyebrow'          => 'ABOUT OUR FIRM',
                    'heading'          => 'Two Decades of Trusted Fiduciary Service',
                    'subheading'       => 'Our experienced advisory team brings institutional rigor and personalized dedication to every client relationship.',
                    'text'             => 'Founded with a commitment to integrity and transparency, we deliver strategic wealth planning tailored to your goals.',
                    'image_url'        => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
                    'experience_years' => '20+'
                ],
                'Company History' => [
                    'eyebrow'    => 'OUR JOURNEY',
                    'heading'    => 'Our Company History',
                    'subheading' => 'A decade of growth, innovation, and unwavering commitment to client success.'
                ],
                'Featured Services' => [
                    'eyebrow'    => 'OUR CORE SERVICES',
                    'heading'    => 'Comprehensive Wealth Solutions',
                    'subheading' => 'Customized investment portfolios, tax optimization, and retirement planning.',
                    'text'       => 'Partnering with you at every stage of financial growth to secure your long-term legacy.',
                    'image_url'  => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
                ],
                'Annual Progression' => [
                    'eyebrow'    => 'ANNUAL GROWTH',
                    'heading'    => 'Consistent Year-on-Year Results',
                    'subheading' => 'Our track record of steady portfolio growth speaks for itself.'
                ],
                'Portfolio Section' => [
                    'eyebrow'    => 'OUR PORTFOLIO',
                    'heading'    => 'Selected Investment Outcomes',
                    'subheading' => 'A showcase of key deals and high-performing client portfolios we have managed.'
                ],
                'Branches and Appointment' => [
                    'eyebrow'     => 'OUR OFFICES',
                    'heading'     => 'Visit Our Regional Financial Hubs',
                    'subheading'  => 'Headquarters in New York, London, Singapore, and Zurich.',
                    'text'        => 'Our advisors are available for in-person consultations or secure virtual meetings.',
                    'button_text' => 'BOOK APPOINTMENT',
                    'button_url'  => '#appointment'
                ],
                'Counter Stats' => [
                    'heading'    => 'Proven Results in Numbers',
                    'subheading' => '$2.5B+ Assets Under Advisory • 99% Client Retention • 25+ Global Advisors'
                ],
                'Testimonials Carousel' => [
                    'eyebrow'    => 'CLIENT SUCCESS STORIES',
                    'heading'    => 'What Executives & Families Say',
                    'subheading' => 'Hear directly from business leaders who rely on our strategic wealth advisory.'
                ],
                'Latest News' => [
                    'eyebrow'    => 'NEWS & INSIGHTS',
                    'heading'    => 'Latest from Our Advisory Team',
                    'subheading' => 'Stay informed on market trends, regulatory changes, and financial planning tips.'
                ],
                'Client Logos' => [
                    'heading' => 'Trusted by Leading Institutions'
                ],
                'CTA Banner' => [
                    'heading'     => 'Ready to build and protect your financial legacy?',
                    'subheading'  => 'Schedule a private consultation with a senior financial advisor today.',
                    'button_text' => 'BOOK CONSULTATION',
                    'button_url'  => '#appointment'
                ]
            ];

            $stmt = $pdo->prepare("INSERT INTO `sections` (`section_name`, `content`) VALUES (?, ?)");
            foreach ($defaultSections as $sName => $sContent) {
                $stmt->execute([$sName, json_encode($sContent, JSON_UNESCAPED_UNICODE)]);
            }
        }

        return $pdo;
    } catch (Exception $e) {
        return null;
    }
}

$pdo = getPdoConnection($DB_HOST, $DB_NAME, $DB_USER, $DB_PASS);

// --------------------------------------------------------------------------
// POST REQUEST: SYNC CONTENT FROM LARAVEL BACKEND
// --------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
        exit;
    }

    // Validate Secret API Key (if configured)
    if (!empty($SECRET_API_KEY) && $SECRET_API_KEY !== "YOUR_SECRET_KEY") {
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
                'status'  => 'error', 
                'message' => 'Unauthorized: Invalid API Key. Provided key does not match cPanel secret key.'
            ]);
            exit;
        }
    }

    $updatedSectionsCount = 0;

    // 1. Sync to MySQL Database Tables if PDO connection active
    if ($pdo) {
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
            $stmt = $pdo->prepare("INSERT INTO sections (section_name, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
            foreach ($input['sections'] as $newSec) {
                $name    = $newSec['name'] ?? null;
                $content = $newSec['content'] ?? null;
                if ($name && $content) {
                    $jsonStr = is_string($content) ? $content : json_encode($content, JSON_UNESCAPED_UNICODE);
                    $stmt->execute([$name, $jsonStr]);
                    $updatedSectionsCount++;
                }
            }
        }
    }

    // 2. Also Sync to JSON File for fallback reliability
    if (!file_exists($dataDir)) mkdir($dataDir, 0755, true);
    $existing = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];

    if (!empty($input['primary_color']))   $existing['primary_color']   = $input['primary_color'];
    if (!empty($input['secondary_color'])) $existing['secondary_color'] = $input['secondary_color'];
    if (!empty($input['logo_url']))        $existing['logo_url']        = $input['logo_url'];

    if (!isset($existing['sections']) || !is_array($existing['sections'])) {
        $existing['sections'] = [];
    }

    if (isset($input['sections']) && is_array($input['sections'])) {
        foreach ($input['sections'] as $newSec) {
            $name    = $newSec['name'] ?? null;
            $content = $newSec['content'] ?? null;
            if ($name && $content) {
                $parsedContent = is_string($content) ? (json_decode($content, true) ?: $content) : $content;
                $existing['sections'][$name] = $parsedContent;
                if (!$pdo) $updatedSectionsCount++;
            }
        }
    }

    file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

    http_response_code(200);
    echo json_encode([
        'status'        => 'success',
        'message'       => 'Approved content successfully updated on cPanel MySQL DB & JSON file!',
        'db_active'     => (bool)$pdo,
        'updated_count' => $updatedSectionsCount,
        'data'          => $existing
    ]);
    exit;
}

// --------------------------------------------------------------------------
// GET REQUEST: SERVE LIVE CONTENT FOR REACT TEMPLATE
// --------------------------------------------------------------------------
$result = [
    'primary_color'   => '#0B1B3D',
    'secondary_color' => '#C8102E',
    'logo_url'        => '/assets/intime/logo-dark.png',
    'sections'        => [],
    'sections_list'   => []
];

// 1. Fetch from MySQL Database if connected
if ($pdo) {
    try {
        $settingsStmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
        while ($row = $settingsStmt->fetch()) {
            $result[$row['setting_key']] = $row['setting_value'];
        }

        $secStmt = $pdo->query("SELECT section_name, content FROM sections");
        while ($row = $secStmt->fetch()) {
            $name = $row['section_name'];
            $cnt  = json_decode($row['content'], true) ?: $row['content'];
            $result['sections'][$name] = $cnt;
            $result['sections_list'][] = ['name' => $name, 'content' => $cnt];
        }
    } catch (Exception $e) {
        // Fallback to json if DB query fails
    }
}

// 2. Fallback to JSON File if MySQL was empty or disabled
if (empty($result['sections']) && file_exists($dataFile)) {
    $fileData = json_decode(file_get_contents($dataFile), true) ?: [];
    if (!empty($fileData['primary_color']))   $result['primary_color']   = $fileData['primary_color'];
    if (!empty($fileData['secondary_color'])) $result['secondary_color'] = $fileData['secondary_color'];
    if (!empty($fileData['logo_url']))        $result['logo_url']        = $fileData['logo_url'];

    if (isset($fileData['sections']) && is_array($fileData['sections'])) {
        $result['sections'] = $fileData['sections'];
        foreach ($fileData['sections'] as $secName => $secContent) {
            $result['sections_list'][] = [
                'name'    => $secName,
                'content' => is_string($secContent) ? json_decode($secContent, true) ?: $secContent : $secContent
            ];
        }
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;


