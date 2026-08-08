-- Seed Default Administrator (Password: adminpassword)
INSERT INTO users (id, full_name, email, password, role, status, created_at)
SELECT 1, 'System Administrator', 'admin@smartwaste.com', '$2b$10$FY1WnLe1sJPMY2exdU6MZetxScuf9Cwm0sHPbCnrouYhH8G9KWZay', 'ADMIN', 'ACTIVE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@smartwaste.com');

-- Seed Default Waste Categories
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 1, 'Organic', false, 'Compost the organic waste or place it in the green compost bin.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Organic');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 2, 'Plastic', true, 'Rinse plastic containers and place them in the blue recycling bin.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Plastic');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 3, 'Paper', true, 'Keep paper dry and flat, then place it in the recycling bin.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Paper');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 4, 'Metal', true, 'Clean aluminum cans and tin foil, then place them in the recycling bin.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Metal');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 5, 'Glass', true, 'Rinse glass bottles and jars and separate by color if required locally.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Glass');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 6, 'E-Waste', true, 'Take electronics to designated local e-waste drop-off center.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'E-Waste');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 7, 'Hazardous', false, 'Store safely and take to your local household hazardous waste facility.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Hazardous');
INSERT INTO waste_categories (id, category_name, recyclable, disposal_method)
SELECT 8, 'Other', false, 'Place in the general non-recyclable landfill bin.' WHERE NOT EXISTS (SELECT 1 FROM waste_categories WHERE category_name = 'Other');

-- Seed Cache Metrics Singleton
INSERT INTO cache_metrics (id, gemini_requests, cache_hits)
SELECT 1, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM cache_metrics WHERE id = 1);
