import * as React from 'react';
import { Navigate } from 'react-router-dom';

export interface IResetPasswordPrivateRouteProps {
    children:JSX.Element;
    token:string | null
}

export default function ResetPasswordPrivateRoute ({children, token}: IResetPasswordPrivateRouteProps ) {

    

    if(token){
        return children
    }
  return <Navigate to="/auth/login" />
}
