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

if (!$input || empty($input['username']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username and password are required"]);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

try {
    // Fetch user
    $stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid username or password"]);
        exit;
    }

    // Check if user is pending admin approval
    if ($user['role'] === 'pending_admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Your admin account is pending approval. Please contact an existing admin."]);
        exit;
    }

    // Log the login activity
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

    $logStmt = $pdo->prepare("INSERT INTO login_logs (user_id, username, ip_address, user_agent) VALUES (:user_id, :username, :ip_address, :user_agent)");
    $logStmt->execute([
        ':user_id' => $user['id'],
        ':username' => $user['username'],
        ':ip_address' => $ip_address,
        ':user_agent' => $user_agent
    ]);

    // Start session and set data
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "role" => $user['role']
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