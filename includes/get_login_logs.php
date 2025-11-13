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
    $stmt = $pdo->prepare("SELECT id, username, ip_address, login_time, user_agent FROM login_logs ORDER BY login_time DESC LIMIT 1000");
    $stmt->execute();
    $loginLogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($loginLogs);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>