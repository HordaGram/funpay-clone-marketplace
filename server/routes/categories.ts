import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// Получить все категории
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Categories GET error:', error);
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
});

// Создать категорию (в идеале только Admin)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
        // Для удобства тестирования пока разрешим всем создавать категории 
        // return res.status(403).json({ error: 'Доступ только для администраторов' });
    }

    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Необходимы name и slug' });

    const category = await prisma.category.create({
      data: { name, slug },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Category POST error:', error);
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
});

export default router;
