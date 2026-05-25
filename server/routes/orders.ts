import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/auth';

const router = express.Router();

// 1. Создание заказа (Покупатель оплачивает товар -> деньги в буфер)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user?.userId;

    if (!buyerId) return res.status(401).json({ error: 'Не авторизован' });
    if (!productId) return res.status(400).json({ error: 'Не указан ID товара' });

    // Используем интерактивную транзакцию Prisma для гарантии консистентности
    const result = await prisma.$transaction(async (tx) => {
      // Проверяем товар
      const product = await tx.product.findUnique({ where: { id: productId } });
      
      if (!product) throw new Error('Товар не найден');
      if (product.status !== 'ACTIVE') throw new Error('Товар недоступен для покупки');
      if (product.sellerId === buyerId) throw new Error('Вы не можете купить свой собственный товар');

      // Проверяем баланс покупателя
      const buyer = await tx.user.findUnique({ where: { id: buyerId } });
      if (!buyer || buyer.balance < product.price) {
        throw new Error('Недостаточно средств на балансе');
      }

      // 1. Списываем деньги у покупателя (перемещаем в "буфер" системы)
      await tx.user.update({
        where: { id: buyerId },
        data: { balance: { decrement: product.price } },
      });

      // 2. Создаем заказ со статусом PAID
      const order = await tx.order.create({
        data: {
          price: product.price,
          status: 'PAID',
          buyerId,
          sellerId: product.sellerId,
          productId: product.id,
        },
      });

      // 3. Логируем транзакцию (Удержание средств)
      await tx.transaction.create({
        data: {
          amount: product.price,
          type: 'ESCROW_HOLD',
          userId: buyerId,
          orderId: order.id,
        },
      });

      // 4. Меняем статус товара на SOLD (если это уникальный цифровой товар)
      await tx.product.update({
        where: { id: product.id },
        data: { status: 'SOLD' },
      });

      return order;
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Order Create Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// 2. Продавец передал товар (Изменение статуса на DELIVERED)
router.put('/:id/deliver', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orderId = req.params.id;
    const sellerId = req.user?.userId;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) return res.status(404).json({ error: 'Заказ не найден' });
    if (order.sellerId !== sellerId) return res.status(403).json({ error: 'Нет прав' });
    if (order.status !== 'PAID') return res.status(400).json({ error: 'Товар уже передан или сделка завершена' });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Order Deliver Error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 3. Покупатель подтверждает получение (Деньги переводятся продавцу)
router.put('/:id/confirm', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orderId = req.params.id;
    const buyerId = req.user?.userId;

    // Выполняем в транзакции
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });

      if (!order) throw new Error('Заказ не найден');
      if (order.buyerId !== buyerId) throw new Error('Нет прав');
      if (order.status === 'COMPLETED') throw new Error('Заказ уже завершен');
      if (order.status === 'DISPUTE') throw new Error('По этому заказу открыт спор');

      // 1. Пополняем баланс продавца
      await tx.user.update({
        where: { id: order.sellerId },
        data: { balance: { increment: order.price } },
      });

      // 2. Меняем статус заказа
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
      });

      // 3. Логируем зачисление продавцу из Escrow
      await tx.transaction.create({
        data: {
          amount: order.price,
          type: 'ESCROW_RELEASE',
          userId: order.sellerId,
          orderId: order.id,
        },
      });

      return updatedOrder;
    });

    res.json(result);
  } catch (error: any) {
    console.error('Order Confirm Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Получить все заказы пользователя (и как продавца, и как покупателя)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        product: { select: { title: true } },
        buyer: { select: { username: true } },
        seller: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
