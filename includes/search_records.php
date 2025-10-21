<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || (empty($input['record_id']) && empty($input['full_name']))) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide Record ID or Full Name to search"]);
    exit;
}

try {
    require_once 'db_connect.php';

    $conditions = [];
    $params = [];

    if (!empty($input['record_id'])) {
        $conditions[] = "id = ?";
        $params[] = $input['record_id'];
    }

    if (!empty($input['full_name'])) {
        $conditions[] = "full_name LIKE ?";
        $params[] = "%" . $input['full_name'] . "%";
    }

    $whereClause = implode(" OR ", $conditions);

    $sql = "SELECT id, full_name, storage_slot, status, created_at, family_name, family_phone
            FROM mortuary_records
            WHERE $whereClause
            ORDER BY created_at DESC LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $record = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($record) {
        echo json_encode([
            "success" => true,
            "message" => "Record found",
            "data" => $record
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record found matching your search criteria"
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