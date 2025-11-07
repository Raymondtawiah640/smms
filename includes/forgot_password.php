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

    // Delete any existing reset codes for this user
    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    // Store reset code with expiration (1 hour)
    $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));
    $stmt = $pdo->prepare("
        INSERT INTO password_resets (user_id, username, reset_code, expires_at, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$user['id'], $user['username'], $reset_code, $expires_at]);

    error_log('Inserted reset_code: ' . $reset_code . ' for user ' . $user['username'] . ' expires at ' . $expires_at);

    // Return success with the user's username for frontend use
    echo json_encode([
        'success' => true,
        'message' => 'Reset code generated successfully',
        'username' => $user['username'],
        'debug_code' => $reset_code // Remove this in production
    ]);

} catch (PDOException $e) {
    error_log('Database error in forgot_password.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred: ' . $e->getMessage()]);
}
?>