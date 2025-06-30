import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const newIncome = await prisma.income.create({
      data: {
        ...req.body,
        account: { connect: { id: accountId } }
      }
    });

     
     //Modify the Account to add the pagament
    await prisma.account.update({
      where: { id: accountId },
      data: { value: account.value + newIncome.value }
    });

    res.status(201).json(newIncome);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomes = await prisma.income.findMany();
    res.json(incomes);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

export const getByAccount = async ( req:Request,res:Response):Promise<void> => {
    try {
        const accountId = parseInt(req.params.accountId)
        const account = await prisma.account.findUnique({where:{id:accountId}})
        if(!account){
            res.status(404).json({ message: "account Not Found" });
            return;
        }
        const incomes = await prisma.income.findMany({where: {accountId:accountId}});
        res.json(incomes)
    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}

// DELETE an income and update account value
export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomeId = parseInt(req.params.incomeId);

    const income = await prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!income) {
      res.status(404).json({ message: "Income not found" });
      return;
    }

    const account = await prisma.account.findUnique({
      where: { id: income.accountId },
    });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    // Remove income and update account balance
    await prisma.income.delete({
      where: { id: incomeId },
    });

    await prisma.account.update({
      where: { id: income.accountId },
      data: { value: account.value - income.value },
    });

    res.status(200).json({ message: "Income deleted and account updated." });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting: ${error.message}` });
  }
};

// UPDATE (PUT) an income
export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomeId = parseInt(req.params.incomeId);

    const originalIncome = await prisma.income.findUnique({ where: { id: incomeId } });
    if (!originalIncome) {
      res.status(404).json({ message: "Income not found" });
      return;
    }

    const account = await prisma.account.findUnique({ where: { id: originalIncome.accountId } });
    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    // Calculate difference in value to adjust account balance
    const updated = await prisma.income.update({
      where: { id: incomeId },
      data: req.body,
    });

    const difference = updated.value - originalIncome.value;

    await prisma.account.update({
      where: { id: account.id },
      data: { value: account.value + difference },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating: ${error.message}` });
  }
};


export default {
post,
getAll,
getByAccount,
deleteIncome,
put
}