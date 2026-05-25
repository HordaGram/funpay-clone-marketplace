import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// Получить список товаров с фильтрацией
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Формируем условия поиска
    const whereClause: any = {
      status: 'ACTIVE' // По умолчанию показываем только активные товары
    };

    if (category) {
      whereClause.category = {
        slug: String(category)
      };
    }

    if (search) {
      whereClause.title = {
        contains: String(search)
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        seller: {
          select: { id: true, username: true } // Не отдаем пароль и email продавца!
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// Получить один товар по ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        seller: {
          select: { id: true, username: true, createdAt: true }
        }
      }
    });

    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать новый товар (Только для авторизованных)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, price, categoryId } = req.body;
    const sellerId = req.user?.userId;

    if (!sellerId) return res.status(401).json({ error: 'Не авторизован' });

    if (!title || !description || price === undefined || !categoryId) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        categoryId,
        sellerId
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Products POST error:', error);
    res.status(500).json({ error: 'Ошибка при создании товара' });
  }
});

// Редактировать товар (Только владелец)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, price, status } = req.body;
    const sellerId = req.user?.userId;

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    if (product.sellerId !== sellerId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Нет прав на редактирование чужого товара' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(status && { status })
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Products PUT error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить товар (Только владелец или Админ)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sellerId = req.user?.userId;

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    if (product.sellerId !== sellerId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Нет прав на удаление чужого товара' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Products DELETE error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
