import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { where } from 'sequelize/types';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, age, email } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
      data: { username, password, age, email },
      });

      await prisma.config.create({
        data: {
          can_modify_date: false,
          can_account_go_bellow_zero: false,
          put_change_current_value: false,
          userId: user.id,
        },
      });

      res.status(201).json(user);
    }else{
     res.status(409).json({ error: "User already exists" });
    }

    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userList = await prisma.user.findMany({ include: { accounts: true,configs:true } });
    res.json(userList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id:id }, include: { accounts: true } });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserByName = async (req:Request,res:Response):Promise<void> => {
  try {
    const username = req.params.username
    const user = await prisma.user.findUnique({where: {username:username}})
    
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.json(user);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: req.body
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};




export const getTotalMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const accounts = await prisma.account.findMany({ where: { userId: id } });

    const totalsByMoneyType: { [moneyType: string]: number } = {};

    accounts.forEach(account => {
      const type = account.moneyType || "UNKNOWN";
      if (!totalsByMoneyType[type]) {
        totalsByMoneyType[type] = 0;
      }
      totalsByMoneyType[type] += account.value;
    });

    res.json({ totals: totalsByMoneyType });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser,
  getAllUser,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
  getTotalMoney
};