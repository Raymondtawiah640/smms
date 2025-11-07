<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['reset_code'])) {
    echo json_encode(['success' => false, 'message' => 'Username and reset code are required']);
    exit;
}

$username = trim($data['username']);
$reset_code = trim($data['reset_code']);

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username cannot be empty']);
    exit;
}

if (strlen($reset_code) !== 4 || !is_numeric($reset_code)) {
    echo json_encode(['success' => false, 'message' => 'Invalid reset code format']);
    exit;
}

try {
    // Check if user exists by username
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'No account found with this username']);
        exit;
    }

    // Store reset code with expiration (15 minutes)
    $expires_at = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    $stmt = $pdo->prepare("
        INSERT INTO password_resets (user_id, reset_code, expires_at, created_at)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
        reset_code = VALUES(reset_code),
        expires_at = VALUES(expires_at),
        created_at = NOW()
    ");
    $stmt->execute([$user['id'], $reset_code, $expires_at]);

    // Return success with the user's username for frontend use
    echo json_encode([
        'success' => true,
        'message' => 'Reset code generated successfully',
        'email' => $user['username'],
        'debug_code' => $reset_code // Remove this in production
    ]);

} catch (PDOException $e) {
    error_log('Database error in forgot_password.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred: ' . $e->getMessage()]);
}
?>