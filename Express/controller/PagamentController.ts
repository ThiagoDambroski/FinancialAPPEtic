import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// ✅ Create new pagament
export const post = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const newPagament = await prisma.pagament.create({
      data: {
        ...req.body,
        account: { connect: { id: accountId } }
      }
    });

    if (!account.userId) {
      res.status(400).json({ message: "Account is not linked to a user." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: account.userId },
      include: { configs: true }
    });

    if (!user || !user.configs) {
      res.status(400).json({ message: "User configuration not found." });
      return;
    }

    const config = user.configs;

    const newValue = config.can_account_go_bellow_zero
      ? Math.max(account.value - newPagament.value, 0)
      : account.value - newPagament.value;

    await prisma.account.update({
      where: { id: account.id },
      data: { value: newValue }
    });

    res.status(201).json(newPagament);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all pagaments
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagaments = await prisma.pagament.findMany();
    res.status(200).json(pagaments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get pagaments by account
export const getByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const pagaments = await prisma.pagament.findMany({
      where: { accountId: accountId }
    });

    res.json(pagaments);
  } catch (error: any) {
    res.status(500).json({ message: `Error ${error.message}` });
  }
};


export const put = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagamentId = parseInt(req.params.pagamentId);
    const pagament = await prisma.pagament.findUnique({ where: { id: pagamentId } });

    if (!pagament) {
      res.status(404).json({ message: "Pagament not found" });
      return;
    }

    const account = await prisma.account.findUnique({ where: { id: pagament.accountId } });
    if (!account || !account.userId) {
      res.status(400).json({ message: "Account or user config not found." });
      return;
    }

    const updated = await prisma.pagament.update({
      where: { id: pagamentId },
      data: req.body,
    });

    // If value changed, adjust the account balance
    if (req.body.value !== undefined && req.body.value !== pagament.value) {
      const user = await prisma.user.findUnique({
        where: { id: account.userId },
        include: { configs: true }
      });

      if (!user?.configs) {
        res.status(400).json({ message: "User config not found" });
        return;
      }

      const valueDiff = pagament.value - req.body.value;
      const newAccountValue = user.configs.can_account_go_bellow_zero
        ? Math.max(account.value + valueDiff, 0)
        : account.value + valueDiff;

      await prisma.account.update({
        where: { id: account.id },
        data: { value: newAccountValue }
      });
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagamentId = parseInt(req.params.pagamentId);
    const pagament = await prisma.pagament.findUnique({ where: { id: pagamentId } });

    if (!pagament) {
      res.status(404).json({ message: "Pagament not found" });
      return;
    }

    const account = await prisma.account.findUnique({ where: { id: pagament.accountId } });
    if (!account || !account.userId) {
      res.status(400).json({ message: "Account or user config not found." });
      return;
    }

    await prisma.pagament.delete({ where: { id: pagamentId } });

    const user = await prisma.user.findUnique({
      where: { id: account.userId },
      include: { configs: true }
    });

    if (!user?.configs) {
      res.status(400).json({ message: "User config not found" });
      return;
    }

    const newValue = user.configs.can_account_go_bellow_zero
      ? Math.max(account.value + pagament.value, 0)
      : account.value + pagament.value;

    await prisma.account.update({
      where: { id: account.id },
      data: { value: newValue }
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  post,
  getAll,
  getByAccount,
  put,
  remove
};
