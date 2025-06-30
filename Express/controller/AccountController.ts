import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { where } from 'sequelize/types';

export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }


    //Check if empty create [] for lists 
    const newAccount = await prisma.account.create({
      data: {
        ...req.body,
        user: { connect: { id: userId } }
      }
    });



    res.status(201).json(newAccount);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId)

    const account = await prisma.account.findUnique({where:{id:accountId}})
    if (!account) {
      res.status(404).json({ message: "Account Not Found" });
      return;
    }
    res.json(account);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};


export const getByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const accounts = await prisma.account.findMany({where:{userId:userId}});
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

export const getAllOperations = async (req:Request,res:Response):Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId)
      const account = await prisma.account.findUnique({where:{id:accountId}})
      if(!account){
        res.status(404).json({ message: "account Not Found" });
        return;
      }
    const pagaments = await prisma.pagament.findMany({where: {accountId:accountId}});
    const incomes = await prisma.income.findMany({where: {accountId:accountId}});
    res.json({pagaments:pagaments,incomes:incomes})
  } catch (error:any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
}


export default {
 post,getAll,getByUser,getAllOperations,getById
};