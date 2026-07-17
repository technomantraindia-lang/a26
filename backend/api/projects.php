<?php
require __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function normalize_project(array $project): array
{
    $imagesStmt = db()->prepare(
        'SELECT image_path
         FROM project_images
         WHERE project_id = ?
         ORDER BY id ASC'
    );
    $imagesStmt->execute([(int) $project['id']]);

    return [
        'id' => (int) $project['id'],
        'project_name' => $project['project_name'],
        'category' => $project['category'] ?: 'Project',
        'description' => $project['description'] ?: 'A26 Designs project with carefully planned spaces, premium detailing and practical execution.',
        'main_image' => project_image_url($project['main_image']),
        'sub_images' => array_map(static function (array $image): string {
            return project_image_url($image['image_path']);
        }, $imagesStmt->fetchAll()),
    ];
}

try {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id > 0) {
        $stmt = db()->prepare(
            'SELECT id, project_name, category, description, main_image
             FROM projects
             WHERE is_active = 1 AND id = ?'
        );
        $stmt->execute([$id]);
    } else {
        $stmt = db()->query(
            'SELECT id, project_name, category, description, main_image
             FROM projects
             WHERE is_active = 1
             ORDER BY id DESC'
        );
    }

    $projects = array_map('normalize_project', $stmt->fetchAll());

    echo json_encode([
        'success' => true,
        'project' => $id > 0 ? ($projects[0] ?? null) : null,
        'projects' => $projects,
    ], JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to load projects.']);
}
