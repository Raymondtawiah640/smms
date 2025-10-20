<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php'; // ✅ adjust to your folder structure

// Handle preflight request for Angular CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read input data
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id']) || !isset($input['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid parameters."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE mortuary_records SET status = :status WHERE id = :id");
    $stmt->execute([
        ":status" => $input["status"],
        ":id" => $input["id"]
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Status updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record found with that ID"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
