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

if (!$data || !isset($data['email']) || !isset($data['new_password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and new password are required']);
    exit;
}

$email = trim($data['email']);
$new_password = trim($data['new_password']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (strlen($new_password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
    exit;
}

try {
    // Check if there's a valid reset code for this user
    $stmt = $pdo->prepare("
        SELECT pr.user_id, pr.reset_code, pr.expires_at, u.id as user_id
        FROM password_resets pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.user_id = (SELECT id FROM users WHERE username = ?) AND pr.expires_at > NOW()
        ORDER BY pr.created_at DESC
        LIMIT 1
    ");
    // Get username from email first
    $username_stmt = $pdo->prepare("SELECT username FROM users WHERE username = ?");
    $username_stmt->execute([$email]); // $email contains username in this context
    $user_row = $username_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_row) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $stmt->execute([$user_row['username']]);
    $reset_record = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reset_record) {
        echo json_encode(['success' => false, 'message' => 'No valid reset code found. Please request a new one.']);
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Update user password
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hashed_password, $reset_record['user_id']]);

    // Delete the used reset code
    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
    $stmt->execute([$reset_record['user_id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Password reset successfully'
    ]);

} catch (PDOException $e) {
    error_log('Database error in reset_password.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred: ' . $e->getMessage()]);
}
?>