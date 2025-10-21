<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['sensor_id']) || !isset($input['temperature']) || !isset($input['humidity'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields: sensor_id, temperature, humidity"]);
    exit;
}

try {
    require_once 'db_connect.php';

    $sql = "INSERT INTO iot_cold_storage (sensor_id, temperature, humidity, power_status, recorded_at)
            VALUES (?, ?, ?, ?, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['sensor_id'],
        $input['temperature'],
        $input['humidity'],
        $input['power_status'] ?? 'ON'
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Sensor reading added successfully",
        "reading_id" => $pdo->lastInsertId(),
        "sensor_id" => $input['sensor_id'],
        "data" => [
            "temperature" => $input['temperature'],
            "humidity" => $input['humidity'],
            "power_status" => $input['power_status'] ?? 'ON'
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>