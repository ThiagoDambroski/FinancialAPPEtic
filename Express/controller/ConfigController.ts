import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';


export const post = async (req: Request,res: Response):Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await prisma.user.findUnique({where: {id: userId}})
        if(!user){
            res.status(404).json({message:"User Not Found"})
            return
        }
        const newConfig = await prisma.config.create({
            data:{
                ...req.body,
                user: {connect: {id: userId}}
            }
        })

        res.status(201).json(newConfig)


    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}


export const getAll = async (req:Request, res:Response):Promise<void> => {
    try {
        const configs = await prisma.config.findMany();
        res.json(configs)
    } catch (error:any) {
        res.status(500).json({ message: `Error ${error.message}` });
    }
}

export default {
    post,getAll
}