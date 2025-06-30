import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCategory = await prisma.pagamentCategory.create({
      data: req.body
    });
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.pagamentCategory.findMany();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export default{
  post,getAll
}