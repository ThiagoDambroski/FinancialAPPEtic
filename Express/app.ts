import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';
import configRoutes from "./routes/ConfigRoutes"
import accountRoutes from './routes/AccountRoutes';
import incomeRoutes from './routes/IncomeRouter';
import incomeCategoryRoutes from './routes/IncomeCategoryRoutes'
import incomePlanRoutes from './routes/PlanIncomeRoutes'
import pagamentRoutes from './routes/PagamentRoutes';
import pagamentCategoryRoutes from './routes/PagamentCategoryRoutes'
import planPagamentRoutes from './routes/PlanPagamentRoutes'
import savingsRoutes from './routes/SavingsRoutes'
import investmentsRoutes from './routes/InvestmentsRoutes'
import cors from 'cors';

const app = express();


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js dev server
  })
);

// Routes
app.use('/users', userRoutes);
app.use('/configs',configRoutes)

app.use('/accounts', accountRoutes);

app.use('/incomes', incomeRoutes);
app.use('/incomeCategory',incomeCategoryRoutes)
app.use('/planIncome',incomePlanRoutes)

app.use('/pagaments', pagamentRoutes);
app.use('/pagamentCategory',pagamentCategoryRoutes)
app.use('/planPagament',planPagamentRoutes)

app.use("/savings",savingsRoutes)
app.use("/investments",investmentsRoutes)



// Health check


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
