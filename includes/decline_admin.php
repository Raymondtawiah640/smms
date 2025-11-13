<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['admin_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Admin ID is required"]);
    exit;
}

$adminId = $input['admin_id'];

try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id AND role = 'pending_admin'");
    $stmt->execute([':id' => $adminId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Admin request declined and removed"]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Pending admin not found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>