<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php'; // ✅ ensure correct relative path

// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $stmt = $pdo->query("SELECT invoice_id, full_name, national_id, date_of_death, storage_slot, family_name, family_phone, family_email, amount, paid, created_at FROM mortuary_records WHERE amount > 0 ORDER BY created_at DESC");
    $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $invoices
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error fetching invoices: " . $e->getMessage()
    ]);
}
?>