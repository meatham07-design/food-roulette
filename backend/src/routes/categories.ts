import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        nameEn: cat.nameEn,
        icon: cat.icon,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/categories/:id
 * Get a single category with restaurants
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        restaurants: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon,
        restaurants: category.restaurants.map(rc => ({
          id: rc.restaurant.id,
          name: rc.restaurant.name,
          address: rc.restaurant.address,
          latitude: rc.restaurant.latitude,
          longitude: rc.restaurant.longitude,
          rating: rc.restaurant.rating,
          priceLevel: rc.restaurant.priceLevel,
          photos: rc.restaurant.photos,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;

