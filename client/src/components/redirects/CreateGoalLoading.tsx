import * as React from 'react';
import { UseSelector } from '../../redux/store';
import GoalLoadingCard from '../Loading/GoalLoadingCard';

export interface ICreateGoalLoadingProps {
    children:JSX.Element
}

export default function CreateGoalLoading ({children}: ICreateGoalLoadingProps) {
    const {createCarLoading, createHouseLoading, createRetireLoading} = UseSelector(state => state.tableSlice)


  return  createCarLoading || createHouseLoading || createRetireLoading ?  <GoalLoadingCard /> : children
}
