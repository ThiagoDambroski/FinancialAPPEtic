import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';



export const post = async (req:Request,res:Response): Promise<void> => {
    try {
        const configId = parseInt(req.params.configId)
        
        const config = await prisma.config.findUnique({where:{id: configId}})
        if(!config){
            res.status(404).json({ message: "Config Not Found" });
            return;
        }

        const newIncomeCategory = await prisma.incomeCategory.create({
            data:{
                ...req.body,
                config:{connect: {id:configId}}
            }
        })


       


        
        res.status(201).json(newIncomeCategory)

    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}

export const getAll = async (req:Request,res:Response):Promise<void> => {
    try {
        const incomeCategorys = await prisma.config.findMany();
        res.json(incomeCategorys)
    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}

export default {
 post,getAll
};