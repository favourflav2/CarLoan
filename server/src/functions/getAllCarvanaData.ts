import { Request, Response, NextFunction } from "express";
import { allCarData } from "../data/Data.js";

interface GetAllCarvanaDataType extends Request {
query:{
  page:string;
}
}

// Not using this function no more ... going to only use filter data function

export async function carVanaData(req:GetAllCarvanaDataType, res:Response) {
    try {
      let checkData = allCarData.filter((item) => isNaN(item.price) !== true);
  
      // Pagination on the backend
      const page = parseInt(req.query.page) || 1;
      const limit = 18;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = checkData.slice(startIndex, endIndex);
      const totalPages = Math.ceil(checkData.length / limit);
      const paginatedData = {
        cars: result,
        page: page,
        limit: limit,
        totalPages,
        totalCount: checkData.length,
      };
  
      res.send(paginatedData);
    } catch (e) {
      console.log(e);
      res.status(400).json({ msg: e.message });
    }
  }