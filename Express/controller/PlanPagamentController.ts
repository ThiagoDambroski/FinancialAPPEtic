import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Create a new planPagament
export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const newPlanPagament = await prisma.planPagament.create({
      data: {
        ...req.body,
        account: { connect: { id: accountId } },
      },
    });

    res.status(201).json(newPlanPagament);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// Create a pagament based on planPagament
export const postPagament = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);

    const planPagament = await prisma.planPagament.findUnique({
      where: { id: planId },
    });

    if (!planPagament || !planPagament.accountId) {
      res.status(404).json({ message: "PlanPagament not found or missing accountId." });
      return;
    }

    const account = await prisma.account.findUnique({
      where: { id: planPagament.accountId },
    });

    if (!account) {
      res.status(404).json({ message: "Account not found." });
      return;
    }

    const pagamentObj = {
      name: planPagament.name,
      value: planPagament.value,
      date: planPagament.date ?? new Date(),
      desc: planPagament.desc,
    };

    const newPagament = await prisma.pagament.create({
      data: {
        ...pagamentObj,
        planPagament: { connect: { id: planPagament.id } },
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
      ? account.value - newPagament.value
      : Math.max(account.value - newPagament.value, 0);

    await prisma.account.update({
      where: { id: account.id },
      data: { value: newValue },
    });

    // Update plan date if recurrent
    if (planPagament.recurrent && planPagament.date) {
      const currentDate = new Date(planPagament.date);
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(currentDate.getMonth() + 1);

      if (nextMonth.getDate() !== currentDate.getDate()) {
        nextMonth.setDate(0);
      }

      await prisma.planPagament.update({
        where: { id: planPagament.id },
        data: { date: nextMonth },
      });
    }

    res.status(201).json(newPagament);
  } catch (error: any) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Get all planPagaments
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const planPagaments = await prisma.planPagament.findMany();
    res.json(planPagaments);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// Get planPagaments by account
export const getByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const planPagaments = await prisma.planPagament.findMany({
      where: { accountId: accountId },
    });

    res.json(planPagaments);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};

// Edit (PUT) a planPagament
export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);
    const updated = await prisma.planPagament.update({
      where: { id: planId },
      data: req.body,
    });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating: ${error.message}` });
  }
};

// Safe delete: only if no associated pagaments
export const deletePlanPagament = async (req: Request, res: Response): Promise<void> => {
  try {
    const planId = parseInt(req.params.planId);

    const plan = await prisma.planPagament.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      res.status(404).json({ message: "PlanPagament not found" });
      return;
    }

    // First, unset the planPagamentId from all related pagaments
    await prisma.pagament.updateMany({
      where: { planPagamentId: planId },
      data: { planPagamentId: null },
    });

    // Then delete the planPagament
    await prisma.planPagament.delete({
      where: { id: planId },
    });

    res.status(200).json({ message: "PlanPagament deleted and references removed from pagaments." });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting: ${error.message}` });
  }
};

export default {
  post,
  postPagament,
  getAll,
  getByAccount,
  put,
  deletePlanPagament,
};
