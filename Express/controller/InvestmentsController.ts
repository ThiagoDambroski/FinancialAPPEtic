import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const post = async (req:Request,res:Response):Promise<void> => {
    try {
        const accountId = parseInt(req.params.accountId)
        const account = await prisma.account.findUnique({where: {id: accountId}})
        if(!account){
            res.status(404).json({ message: "User Not Found" });
            return;
        }

        const newInvestment = await prisma.investments.create({
            data:{
                ...req.body,
                account: {connect: {id:accountId}}
            }
        })

        res.status(201).json(newInvestment)

    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}


export const getAll = async (req:Request,res:Response):Promise<void> => {
    try {
       const investments = prisma.investments.findMany()
       res.json(investments)

    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}

export default {
 post,getAll
};