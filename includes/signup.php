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

if (!$input || empty($input['username']) || empty($input['password']) || empty($input['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username, password, and role are required"]);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];
$role = trim($input['role']);

if (!in_array($role, ['admin', 'staff', 'family'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role. Please select from: admin, staff, or family"]);
    exit;
}

// Check if this is the first user (no admins exist yet)
$stmt = $pdo->prepare("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
$stmt->execute();
$adminCount = $stmt->fetch()['admin_count'];

// If this is the first user OR role is not admin, allow direct registration
// If role is admin and there are existing admins, set as pending_admin for approval
if ($role === 'admin' && $adminCount > 0) {
    $actualRole = 'pending_admin';
} else {
    $actualRole = $role;
}

try {
    // Check if username exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username already exists"]);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES (:username, :password_hash, :role)");
    $stmt->execute([
        ':username' => $username,
        ':password_hash' => $passwordHash,
        ':role' => $actualRole
    ]);

    $message = ($actualRole === 'pending_admin')
        ? "Admin registration request submitted successfully. Your account is pending approval by an existing admin."
        : "User registered successfully";

    echo json_encode([
        "success" => true,
        "message" => $message
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>