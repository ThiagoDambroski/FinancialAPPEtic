import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const post = async (req:Request,res:Response):Promise<void> => {
    try {
        const accountId = parseInt(req.params.accountId);
        const account = await prisma.account.findUnique({where: {id: accountId}})
        if(!account){
            res.status(404).json({ message: "Account Not Found" });
            return;
        }

        const newSavings = await prisma.savings.create({
            data:{
                ...req.body,
                account: {connect: {id: accountId}}
            }
        })
        res.status(201).json(newSavings)

    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}


export const getAll = async (req:Request,res:Response):Promise<void> => {
    try {
        const savings = prisma.savings.findMany();
        res.json(savings);
    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}
export default {
 post,getAll
};