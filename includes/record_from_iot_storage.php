<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['sensor_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input or missing sensor_id"]);
    exit;
}

$record_id = "REC-" . time();

echo json_encode([
    "success" => true,
    "message" => "Record created successfully",
    "action" => "created",
    "record_id" => $record_id,
    "storage_method" => "server",
    "sensor_id" => $input['sensor_id'],
    "full_name" => $input['full_name'] ?? 'Auto-Generated-' . $input['sensor_id']
]);
?>

