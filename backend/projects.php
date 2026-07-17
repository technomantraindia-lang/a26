<?php
require __DIR__ . '/db.php';

$config = require __DIR__ . '/config.php';
$errors = [];
$message = '';

if (!is_dir($config['upload_dir'])) {
    mkdir($config['upload_dir'], 0775, true);
}

function upload_one_image(string $field, array &$errors, bool $required = true): ?string
{
    global $config;

    if (empty($_FILES[$field]['name'])) {
        if ($required) {
            $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
        }
        return null;
    }

    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Upload failed for ' . $field . '.';
        return null;
    }

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = mime_content_type($_FILES[$field]['tmp_name']);

    if (!isset($allowed[$mime])) {
        $errors[] = 'Only JPG, PNG and WEBP images are allowed.';
        return null;
    }

    $name = $field . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
    $relative = $config['upload_url'] . $name;
    $target = $config['upload_dir'] . $name;

    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $target)) {
        $errors[] = 'Could not save ' . $field . '.';
        return null;
    }

    return $relative;
}

function upload_many_images(string $field, array &$errors): array
{
    global $config;

    if (empty($_FILES[$field]['name'][0])) {
        return [];
    }

    $paths = [];
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $total = count($_FILES[$field]['name']);

    for ($i = 0; $i < $total; $i++) {
        if ($_FILES[$field]['error'][$i] !== UPLOAD_ERR_OK) {
            $errors[] = 'One sub image failed to upload.';
            continue;
        }

        $mime = mime_content_type($_FILES[$field]['tmp_name'][$i]);
        if (!isset($allowed[$mime])) {
            $errors[] = 'Only JPG, PNG and WEBP sub images are allowed.';
            continue;
        }

        $name = $field . '-' . date('YmdHis') . '-' . $i . '-' . bin2hex(random_bytes(4)) . '.' . $allowed[$mime];
        $relative = $config['upload_url'] . $name;
        $target = $config['upload_dir'] . $name;

        if (move_uploaded_file($_FILES[$field]['tmp_name'][$i], $target)) {
            $paths[] = $relative;
        } else {
            $errors[] = 'Could not save one sub image.';
        }
    }

    return $paths;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['delete_id'])) {
        $deleteId = (int) $_POST['delete_id'];
        db()->prepare('DELETE FROM project_images WHERE project_id = ?')->execute([$deleteId]);
        db()->prepare('DELETE FROM projects WHERE id = ?')->execute([$deleteId]);
        $returnCategory = trim($_POST['return_category'] ?? '');
        header('Location: projects.php?deleted=1' . ($returnCategory !== '' ? '&category=' . urlencode($returnCategory) : ''));
        exit;
    } elseif (isset($_POST['update_id'])) {
        $projectId = (int) $_POST['update_id'];
        $projectName = trim($_POST['project_name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $description = trim($_POST['description'] ?? '');

        if ($projectName === '') {
            $errors[] = 'Project name is required.';
        }

        if ($category === '') {
            $errors[] = 'Category is required.';
        }

        $mainImage = upload_one_image('main_image', $errors, false);
        $subImages = upload_many_images('sub_images', $errors);
        $hasNewSubImages = !empty($_FILES['sub_images']['name'][0]);
        $removeImageIds = array_map('intval', $_POST['remove_images'] ?? []);

        if (!$errors) {
            $pdo = db();
            $pdo->beginTransaction();

            if ($mainImage) {
                $stmt = $pdo->prepare(
                    'UPDATE projects
                     SET project_name = ?, category = ?, description = ?, main_image = ?
                     WHERE id = ?'
                );
                $stmt->execute([$projectName, $category, $description, $mainImage, $projectId]);
            } else {
                $stmt = $pdo->prepare(
                    'UPDATE projects
                     SET project_name = ?, category = ?, description = ?
                     WHERE id = ?'
                );
                $stmt->execute([$projectName, $category, $description, $projectId]);
            }

            if ($hasNewSubImages) {
                $deleteAllStmt = $pdo->prepare('DELETE FROM project_images WHERE project_id = ?');
                $deleteAllStmt->execute([$projectId]);
            } elseif ($removeImageIds) {
                $placeholders = implode(',', array_fill(0, count($removeImageIds), '?'));
                $deleteStmt = $pdo->prepare(
                    "DELETE FROM project_images WHERE project_id = ? AND id IN ($placeholders)"
                );
                $deleteStmt->execute(array_merge([$projectId], $removeImageIds));
            }

            if ($subImages) {
                $imageStmt = $pdo->prepare('INSERT INTO project_images (project_id, image_path) VALUES (?, ?)');
                foreach ($subImages as $imagePath) {
                    $imageStmt->execute([$projectId, $imagePath]);
                }
            }

            $pdo->commit();
            $returnCategory = trim($_POST['return_category'] ?? '');
            header('Location: projects.php?updated=1' . ($returnCategory !== '' ? '&category=' . urlencode($returnCategory) : ''));
            exit;
        }
    } else {
        $projectName = trim($_POST['project_name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $description = trim($_POST['description'] ?? '');

        if ($projectName === '') {
            $errors[] = 'Project name is required.';
        }

        if ($category === '') {
            $errors[] = 'Category is required.';
        }

        $mainImage = upload_one_image('main_image', $errors);
        $subImages = upload_many_images('sub_images', $errors);

        if (!$errors) {
            $pdo = db();
            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                'INSERT INTO projects (project_name, category, description, main_image)
                 VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([$projectName, $category, $description, $mainImage]);

            $projectId = (int) $pdo->lastInsertId();
            $imageStmt = $pdo->prepare('INSERT INTO project_images (project_id, image_path) VALUES (?, ?)');
            foreach ($subImages as $imagePath) {
                $imageStmt->execute([$projectId, $imagePath]);
            }

            $pdo->commit();
            $message = 'Project uploaded successfully.';
        }
    }
}

$editProject = null;
$editImages = [];
if (isset($_GET['updated'])) {
    $message = 'Project updated successfully.';
}
if (isset($_GET['deleted'])) {
    $message = 'Project deleted.';
}

if (isset($_GET['edit_id'])) {
    $editStmt = db()->prepare('SELECT * FROM projects WHERE id = ?');
    $editStmt->execute([(int) $_GET['edit_id']]);
    $editProject = $editStmt->fetch() ?: null;

    if ($editProject) {
        $imageStmt = db()->prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY id ASC');
        $imageStmt->execute([(int) $editProject['id']]);
        $editImages = $imageStmt->fetchAll();
    }
}

$categoryRows = db()->query(
    'SELECT category, COUNT(*) AS total
     FROM projects
     WHERE category IS NOT NULL AND category <> ""
     GROUP BY category
     ORDER BY category ASC'
)->fetchAll();

$selectedCategory = trim($_GET['category'] ?? '');
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 5;

if ($selectedCategory !== '') {
    $countStmt = db()->prepare('SELECT COUNT(*) FROM projects WHERE category = ?');
    $countStmt->execute([$selectedCategory]);
    $filteredTotal = (int) $countStmt->fetchColumn();
    $totalPages = max(1, (int) ceil($filteredTotal / $perPage));
    $page = min($page, $totalPages);
    $offset = ($page - 1) * $perPage;

    $projectsStmt = db()->prepare(
        'SELECT p.*, COUNT(pi.id) AS sub_image_count
         FROM projects p
         LEFT JOIN project_images pi ON pi.project_id = p.id
         WHERE p.category = ?
         GROUP BY p.id
         ORDER BY p.id DESC
         LIMIT ? OFFSET ?'
    );
    $projectsStmt->bindValue(1, $selectedCategory, PDO::PARAM_STR);
    $projectsStmt->bindValue(2, $perPage, PDO::PARAM_INT);
    $projectsStmt->bindValue(3, $offset, PDO::PARAM_INT);
    $projectsStmt->execute();
    $projects = $projectsStmt->fetchAll();
} else {
    $filteredTotal = (int) db()->query('SELECT COUNT(*) FROM projects')->fetchColumn();
    $totalPages = max(1, (int) ceil($filteredTotal / $perPage));
    $page = min($page, $totalPages);
    $offset = ($page - 1) * $perPage;

    $projectsStmt = db()->prepare(
        'SELECT p.*, COUNT(pi.id) AS sub_image_count
         FROM projects p
         LEFT JOIN project_images pi ON pi.project_id = p.id
         GROUP BY p.id
         ORDER BY p.id DESC
         LIMIT ? OFFSET ?'
    );
    $projectsStmt->bindValue(1, $perPage, PDO::PARAM_INT);
    $projectsStmt->bindValue(2, $offset, PDO::PARAM_INT);
    $projectsStmt->execute();
    $projects = $projectsStmt->fetchAll();
}

$totalProjects = array_sum(array_map(static function (array $row): int {
    return (int) $row['total'];
}, $categoryRows));

function page_url(int $page, string $category): string
{
    $params = ['page' => $page];
    if ($category !== '') {
        $params['category'] = $category;
    }
    return 'projects.php?' . http_build_query($params);
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>A26 Project Backend</title>
    <style>
        *{box-sizing:border-box}
        body{font-family:Arial,sans-serif;margin:0;background:#f5f1ea;color:#191816}
        header{background:linear-gradient(135deg,#15120e,#2c2115);color:#fff;padding:30px 6vw;border-bottom:4px solid #c9a45c}
        header h1{margin:0 0 8px;font-size:30px}
        header p{margin:0;color:#d8c8ad}
        main{padding:32px 6vw;max-width:1480px;margin:0 auto}
        form,.card{background:#fff;border:1px solid #e2d8c8;border-radius:10px;padding:22px;margin-bottom:22px;box-shadow:0 16px 40px rgba(31,24,14,.07)}
        form h2{margin:0 0 16px}
        label{display:block;font-weight:700;margin-top:14px}
        input,textarea{width:100%;padding:12px;border:1px solid #cfc6b8;border-radius:7px;margin-top:6px;background:#fff}
        input:focus,textarea:focus{outline:2px solid rgba(201,164,92,.35);border-color:#c9a45c}
        textarea{min-height:110px}
        button,.button{display:inline-block;background:#c9a45c;color:#111;border:0;border-radius:6px;padding:12px 18px;font-weight:700;cursor:pointer;text-decoration:none}
        button:hover,.button:hover{filter:brightness(.96)}
        .danger{background:#9d2626;color:#fff}
        .muted{background:#eee4d5;color:#241d13}
        .panel{display:grid;grid-template-columns:minmax(320px,.85fr) minmax(0,1.15fr);gap:24px;align-items:start}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}
        .span-2{grid-column:1/-1}
        .notice{padding:12px 14px;border-radius:6px;margin-bottom:18px}
        .ok{background:#e8f7e8;color:#125d12}
        .err{background:#fde8e8;color:#8b1111}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
        .badge{display:inline-block;background:#c9a45c;color:#111;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700}
        img{width:100%;height:170px;object-fit:cover;border-radius:6px;margin:12px 0}
        small{color:#71695f;display:block;margin-top:6px}
        .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;align-items:center}
        .image-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:10px}
        .image-option{border:1px solid #e2d8c8;border-radius:8px;padding:10px}
        .image-option img{height:120px;margin:0 0 8px}
        .preview{max-width:320px}
        .help{background:#fff8ea;border:1px solid #f0dcae;border-radius:10px;padding:18px;margin-bottom:22px}
        .help strong{display:block;margin-bottom:8px}
        .list-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px}
        .list-head h2{margin:0}
        .filters{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px}
        .filter{display:inline-flex;gap:8px;align-items:center;background:#fff;border:1px solid #e2d8c8;color:#241d13;border-radius:999px;padding:9px 13px;text-decoration:none;font-weight:700}
        .filter.active{background:#191816;color:#fff;border-color:#191816}
        .filter small{margin:0;color:inherit;opacity:.72}
        .empty{background:#fff;border:1px dashed #cfc6b8;border-radius:10px;padding:28px;color:#71695f}
        .pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;background:#fff;border:1px solid #e2d8c8;border-radius:10px;padding:14px}
        .pagination .disabled{opacity:.45;pointer-events:none}
        .card h3{margin:12px 0 0}
        .card form{padding:0;margin:0;border:0;box-shadow:none}
        @media(max-width:900px){.panel,.form-grid{grid-template-columns:1fr}.span-2{grid-column:auto}}
    </style>
</head>
<body>
<header>
    <h1>A26 Project Backend</h1>
    <p>Add one main card image and unlimited sub images for the project detail page.</p>
</header>
<main>
    <?php if ($message): ?><div class="notice ok"><?= htmlspecialchars($message) ?></div><?php endif; ?>
    <?php if ($errors): ?><div class="notice err"><?= htmlspecialchars(implode(' ', $errors)) ?></div><?php endif; ?>

    <div class="help">
        <strong><?= $editProject ? 'Editing project #' . (int) $editProject['id'] : 'Project admin panel' ?></strong>
        <?= $editProject ? 'If you upload new sub images while editing, old sub images will be replaced automatically. If you do not upload new sub images, existing images stay unless you tick Remove.' : 'Create projects with one main card image and multiple gallery images.' ?>
    </div>

    <div class="panel">
    <form method="post" enctype="multipart/form-data">
        <h2><?= $editProject ? 'Edit Project' : 'Add Project' ?></h2>
        <?php if ($editProject): ?>
            <input type="hidden" name="update_id" value="<?= (int) $editProject['id'] ?>">
            <input type="hidden" name="return_category" value="<?= htmlspecialchars($selectedCategory) ?>">
        <?php endif; ?>
        <div class="form-grid">
            <label>Project Name
                <input type="text" name="project_name" value="<?= htmlspecialchars($editProject['project_name'] ?? '') ?>" required>
            </label>
            <label>Category
                <input type="text" name="category" value="<?= htmlspecialchars($editProject['category'] ?? '') ?>" placeholder="Example: Bungalow, Interior, Kitchen" required>
            </label>
            <label class="span-2">Project Details
                <textarea name="description" placeholder="Write project details for the detail page"><?= htmlspecialchars($editProject['description'] ?? '') ?></textarea>
            </label>
        </div>
        <?php if ($editProject): ?>
            <label>Current Main Image</label>
            <img class="preview" src="<?= htmlspecialchars($editProject['main_image']) ?>" alt="">
        <?php endif; ?>
        <label>Main Image
            <input type="file" name="main_image" accept="image/jpeg,image/png,image/webp" <?= $editProject ? '' : 'required' ?>>
            <?php if ($editProject): ?><small>Choose a new file only if you want to replace the main image.</small><?php endif; ?>
        </label>
        <label>Sub Images
            <input type="file" name="sub_images[]" accept="image/jpeg,image/png,image/webp" multiple>
            <small><?= $editProject ? 'Upload new sub images to replace the old gallery. Leave empty to keep current gallery.' : 'Select multiple photos for the detail page gallery.' ?></small>
        </label>
        <?php if ($editProject && $editImages): ?>
            <label>Existing Sub Images</label>
            <div class="image-list">
                <?php foreach ($editImages as $image): ?>
                    <label class="image-option">
                        <img src="<?= htmlspecialchars($image['image_path']) ?>" alt="">
                        <input type="checkbox" name="remove_images[]" value="<?= (int) $image['id'] ?>"> Remove
                    </label>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        <div class="actions">
            <button type="submit"><?= $editProject ? 'Update Project' : 'Upload Project' ?></button>
            <?php if ($editProject): ?><a class="button muted" href="projects.php">Cancel Edit</a><?php endif; ?>
        </div>
    </form>

    <section>
        <div class="list-head">
            <h2><?= $selectedCategory !== '' ? htmlspecialchars($selectedCategory) . ' Projects' : 'All Projects' ?></h2>
            <small><?= count($projects) ?> of <?= (int) $filteredTotal ?> showing</small>
        </div>
        <div class="filters">
            <a class="filter <?= $selectedCategory === '' ? 'active' : '' ?>" href="projects.php?page=1">
                All <small><?= (int) $totalProjects ?></small>
            </a>
            <?php foreach ($categoryRows as $row): ?>
                <a class="filter <?= $selectedCategory === $row['category'] ? 'active' : '' ?>" href="projects.php?category=<?= urlencode($row['category']) ?>&page=1">
                    <?= htmlspecialchars($row['category']) ?> <small><?= (int) $row['total'] ?></small>
                </a>
            <?php endforeach; ?>
        </div>
    <div class="grid">
        <?php foreach ($projects as $project): ?>
            <article class="card">
                <span class="badge"><?= htmlspecialchars($project['category'] ?: 'Project') ?></span>
                <h3><?= htmlspecialchars($project['project_name']) ?></h3>
                <img src="<?= htmlspecialchars($project['main_image']) ?>" alt="">
                <small><?= (int) $project['sub_image_count'] ?> sub images</small>
                <div class="actions">
                    <a class="button" href="projects.php?edit_id=<?= (int) $project['id'] ?><?= $selectedCategory !== '' ? '&category=' . urlencode($selectedCategory) : '' ?>">Edit</a>
                    <form method="post">
                        <input type="hidden" name="delete_id" value="<?= (int) $project['id'] ?>">
                        <?php if ($selectedCategory !== ''): ?><input type="hidden" name="return_category" value="<?= htmlspecialchars($selectedCategory) ?>"><?php endif; ?>
                        <button class="danger" type="submit">Delete</button>
                    </form>
                </div>
            </article>
        <?php endforeach; ?>
        <?php if (!$projects): ?>
            <div class="empty">No projects found in this category.</div>
        <?php endif; ?>
    </div>
    <div class="pagination">
        <a class="button muted <?= $page <= 1 ? 'disabled' : '' ?>" href="<?= htmlspecialchars(page_url($page - 1, $selectedCategory)) ?>">Previous</a>
        <small>Page <?= (int) $page ?> of <?= (int) $totalPages ?></small>
        <a class="button <?= $page >= $totalPages ? 'disabled' : '' ?>" href="<?= htmlspecialchars(page_url($page + 1, $selectedCategory)) ?>">Next</a>
    </div>
    </section>
    </div>
</main>
</body>
</html>
