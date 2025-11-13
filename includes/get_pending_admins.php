<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, role, created_at FROM users WHERE role = 'pending_admin' ORDER BY created_at DESC");
    $stmt->execute();
    $pendingAdmins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($pendingAdmins);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>