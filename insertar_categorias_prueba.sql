-- Script para insertar categorías de prueba
-- Primero obtenemos el ID del usuario actual
SELECT id, nombres FROM usuarios ORDER BY id DESC LIMIT 5;

-- Insertar categorías de INGRESOS para el usuario
INSERT INTO categorias (descripcion, icono, tipo, idusuario) VALUES
('Salario', '💰', 'Ingresos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Freelance', '💼', 'Ingresos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Inversiones', '📈', 'Ingresos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Ventas', '🛒', 'Ingresos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1));

-- Insertar categorías de GASTOS para el usuario
INSERT INTO categorias (descripcion, icono, tipo, idusuario) VALUES
('Alimentación', '🍽️', 'Gastos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Transporte', '🚗', 'Gastos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Entretenimiento', '🎬', 'Gastos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Servicios', '⚡', 'Gastos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1)),
('Salud', '🏥', 'Gastos', (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1));

-- Verificar las categorías insertadas
SELECT * FROM categorias WHERE idusuario = (SELECT id FROM usuarios ORDER BY id DESC LIMIT 1);
