import { CarDataType } from "../data/Data.js";
import { Request, Response, NextFunction } from "express";
import { allCarData } from "../data/Data.js";

function removeDups(arr:Array<CarDataType>) {
    const unique = arr.filter((obj, index) => {
      return index === arr.findIndex((o) => obj.name_modal === o.name_modal && obj.type === o.type && obj.price === o.price);
    });
    return unique;
  }

export async function removeDuplicateAndSaveAllData(req:Request, res:Response) {
    try {
      res.send(removeDups(allCarData));
    } catch (e) {
      console.log(e);
      res.status(400).json({ msg: e.message });
    }
  }