import * as React from 'react';
import { Dispatch, UseSelector } from '../../redux/store';
import { setSelectedGoal } from '../../redux/features/applicationSlice';

export interface IHousePageProps {
}

export default function HousePage (props: IHousePageProps) {

    // Redux States
    const {selectedGoal, shrinkDashboardSidebar } = UseSelector(state => state.app)
    const dispatch = Dispatch()

    if(!selectedGoal || selectedGoal.type !== "House") {
        dispatch(setSelectedGoal(null));
        return null;
      }
  return (
    <div>
      
    </div>
  );
}
