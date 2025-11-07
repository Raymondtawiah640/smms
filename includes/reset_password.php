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

if (!$data || !isset($data['reset_code']) || !isset($data['new_password'])) {
    echo json_encode(['success' => false, 'message' => 'Reset code and new password are required']);
    exit;
}

$reset_code = trim($data['reset_code']);
$new_password = trim($data['new_password']);

error_log('Reset password attempt with reset_code: ' . $reset_code);

if (strlen($new_password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
    exit;
}

try {
    // Check if there's a valid reset code
    $stmt = $pdo->prepare("
        SELECT pr.user_id, pr.reset_code, pr.expires_at, u.id as user_id
        FROM password_resets pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.reset_code = ? AND pr.expires_at > UTC_TIMESTAMP()
        ORDER BY pr.created_at DESC
        LIMIT 1
    ");
    $stmt->execute([$reset_code]);
    $reset_record = $stmt->fetch(PDO::FETCH_ASSOC);

    error_log('Reset record found: ' . ($reset_record ? 'YES' : 'NO') . ' for code: ' . $reset_code);
    if ($reset_record) {
        error_log('Expires at: ' . $reset_record['expires_at'] . ' Current UTC time: ' . gmdate('Y-m-d H:i:s'));
    } else {
        // Check if record exists but is expired
        $stmt2 = $pdo->prepare("SELECT * FROM password_resets WHERE reset_code = ?");
        $stmt2->execute([$reset_code]);
        $expired_record = $stmt2->fetch(PDO::FETCH_ASSOC);
        if ($expired_record) {
            error_log('Record exists but expired. Expires at: ' . $expired_record['expires_at'] . ' Current UTC time: ' . gmdate('Y-m-d H:i:s'));
        } else {
            error_log('No record found with reset_code: ' . $reset_code);
        }
    }

    if (!$reset_record) {
        error_log('No valid reset code found for: ' . $reset_code);
        echo json_encode(['success' => false, 'message' => 'No valid reset code found. Please request a new one.', 'debug' => 'Code: ' . $reset_code]);
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