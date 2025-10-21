
<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php';

// Handle preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['sensor_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input or missing sensor_id"]);
    exit;
}

try {
    // Check if sensor data indicates a new body/storage slot occupation
    $sensorStmt = $pdo->prepare("SELECT * FROM iot_cold_storage WHERE sensor_id = ? ORDER BY recorded_at DESC LIMIT 1");
    $sensorStmt->execute([$input['sensor_id']]);
    $sensorData = $sensorStmt->fetch(PDO::FETCH_ASSOC);

    if (!$sensorData) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Sensor data not found"]);
        exit;
    }

    // Check if this sensor already has an active record
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
    exit;
}