-- Seed Default Administrator (Password: adminpassword)
INSERT IGNORE INTO users (id, full_name, email, password, role, status, created_at)
VALUES (1, 'System Administrator', 'admin@smartwaste.com', '$2a$10$lb2QXVNH0/.DnANhyee3.OM4WMOiTKUiZLe.MAINAypNO0f0hixj2', 'ADMIN', 'ACTIVE', NOW());

-- Seed Default Waste Categories
INSERT IGNORE INTO waste_categories (id, category_name, recyclable, disposal_method) VALUES
(1, 'Organic', false, 'Compost the organic waste or place it in the green compost bin.'),
(2, 'Plastic', true, 'Rinse plastic containers and place them in the blue recycling bin.'),
(3, 'Paper', true, 'Keep paper dry and flat, then place it in the recycling bin.'),
(4, 'Metal', true, 'Clean aluminum cans and tin foil, then place them in the recycling bin.'),
(5, 'Glass', true, 'Rinse glass bottles and jars and separate by color if required locally.'),
(6, 'E-Waste', true, 'Take electronics to designated local e-waste drop-off center.'),
(7, 'Hazardous', false, 'Store safely and take to your local household hazardous waste facility.'),
(8, 'Other', false, 'Place in the general non-recyclable landfill bin.');

-- Seed Admin Reward Ledger
INSERT IGNORE INTO rewards (id, user_id, points, badges)
VALUES (1, 1, 100, 'Founder, Eco-Novice');

-- Seed Cache Metrics Singleton
INSERT IGNORE INTO cache_metrics (id, gemini_requests, cache_hits)
VALUES (1, 0, 0);
