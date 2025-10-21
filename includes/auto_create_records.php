<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php';

try {
    // Get recent sensor data (last 5 minutes)
    $stmt = $pdo->query("
        SELECT sensor_id, temperature, humidity, power_status, recorded_at
        FROM iot_cold_storage
        WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        ORDER BY recorded_at DESC
    ");
    $recentSensors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $results = [];
    $recordsCreated = 0;

    foreach ($recentSensors as $sensor) {
        // Check if sensor indicates active storage (cold temperature and power ON)
        if ($sensor['power_status'] === 'ON' && $sensor['temperature'] < 5) {

            // Check if this sensor already has an active record
            $existingStmt = $pdo->prepare("
                SELECT id FROM mortuary_records
                WHERE storage_slot = ? AND status IN ('pending', 'in-storage')
            ");
            $existingStmt->execute([$sensor['sensor_id']]);
            $existingRecord = $existingStmt->fetch(PDO::FETCH_ASSOC);

            if (!$existingRecord) {
                // Create new record automatically
                $insertStmt = $pdo->prepare("
                    INSERT INTO mortuary_records
                    (full_name, storage_slot, biometric_tag_id, status, date_of_death, created_from_iot, created_at)
                    VALUES
                    (?, ?, ?, 'pending', CURDATE(), 1, NOW())
                ");

                $insertStmt->execute([
                    'Auto-Generated-' . $sensor['sensor_id'],
                    $sensor['sensor_id'],
                    $sensor['sensor_id']
                ]);

                $results[] = [
                    'sensor_id' => $sensor['sensor_id'],
                    'action' => 'record_created',
                    'record_id' => $pdo->lastInsertId()
                ];
                $recordsCreated++;
            } else {
                $results[] = [
                    'sensor_id' => $sensor['sensor_id'],
                    'action' => 'record_exists',
                    'record_id' => $existingRecord['id']
                ];
            }
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Auto-creation process completed",
        "records_created" => $recordsCreated,
        "total_processed" => count($recentSensors),
        "results" => $results
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>