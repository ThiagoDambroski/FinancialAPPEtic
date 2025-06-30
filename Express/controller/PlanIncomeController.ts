import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// === POST a new PlanIncome ===
export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);

    const account = await prisma.account.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    const newPlanIncome = await prisma.planIncome.create({
      data: {
        ...req.body,
        account: { connect: { id: accountId } }
      }
    });

    res.status(201).json(newPlanIncome);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// === Generate Income from PlanIncome ===
export const postIncomeFromPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);

    const planIncome = await prisma.planIncome.findUnique({
      where: { id: planId },
    });

    if (!planIncome || !planIncome.accountId) {
      res.status(404).json({ message: "PlanIncome not found or missing accountId." });
      return;
    }

    const account = await prisma.account.findUnique({
      where: { id: planIncome.accountId },
    });

    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    const incomeObj = {
      name: planIncome.name,
      value: planIncome.value,
      date: planIncome.date ?? new Date(),
      desc: planIncome.desc,
    };

    const newIncome = await prisma.income.create({
      data: {
        ...incomeObj,
        planIncome: { connect: { id: planIncome.id } },
        account: { connect: { id: account.id } },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: account.userId },
      include: { configs: true },
    });

    if (!user || !user.configs) {
      res.status(400).json({ message: "User configuration not found." });
      return;
    }

    const config = user.configs;

    const newValue = config.can_account_go_bellow_zero
      ? account.value + newIncome.value
      : Math.max(account.value + newIncome.value, 0);

    await prisma.account.update({
      where: { id: account.id },
      data: { value: newValue },
    });

    if (planIncome.recurrent && planIncome.date) {
      const currentDate = new Date(planIncome.date);
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(currentDate.getMonth() + 1);

      if (nextMonth.getDate() !== currentDate.getDate()) {
        nextMonth.setDate(0);
      }

      await prisma.planIncome.update({
        where: { id: planIncome.id },
        data: { date: nextMonth },
      });
    }

    res.status(201).json(newIncome);
  } catch (error: any) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// === GET all PlanIncomes ===
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const planIncomes = await prisma.planIncome.findMany();
    res.json(planIncomes);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// === GET PlanIncomes by Account ===
export const getPlanIncomesByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);

    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    const plans = await prisma.planIncome.findMany({
      where: { accountId: accountId },
    });

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// === PUT: Update a PlanIncome ===
export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);

    const plan = await prisma.planIncome.findUnique({ where: { id: planId } });

    if (!plan) {
      res.status(404).json({ message: "PlanIncome not found." });
      return;
    }

    const updated = await prisma.planIncome.update({
      where: { id: planId },
      data: req.body,
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating PlanIncome: ${error.message}` });
  }
};

// === DELETE: Unlink all incomes then delete PlanIncome ===
export const del = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);

    const plan = await prisma.planIncome.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      res.status(404).json({ message: "PlanIncome not found." });
      return;
    }

    await prisma.income.updateMany({
      where: { planIncomeId: planId },
      data: { planIncomeId: null },
    });

    await prisma.planIncome.delete({
      where: { id: planId },
    });

    res.status(200).json({ message: "PlanIncome deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting PlanIncome: ${error.message}` });
  }
};

// === EXPORT ALL ===
export default {
  post,
  postIncomeFromPlan,
  getAll,
  getPlanIncomesByAccount,
  put,
  delete: del,
};
