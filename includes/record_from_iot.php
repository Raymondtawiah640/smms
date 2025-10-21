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

echo json_encode([
    "success" => true,
    "message" => "Record processed successfully",
    "action" => "processed",
    "sensor_id" => $input['sensor_id'],
    "debug" => $input
]);
?>