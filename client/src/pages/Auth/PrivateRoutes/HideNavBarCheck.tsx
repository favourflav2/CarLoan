import * as React from 'react';

export interface IHideNavBarCheckProps {
    children: React.ReactNode;
    location: "/auth/signup" | "/auth/login" | string;
}

// pathname !== "/auth/signup" || pathname !== "/auth/signup"

export default function HideNavBarCheck ({children,location}: IHideNavBarCheckProps) {
  return location === "/auth/login" || location === "/auth/signup" ? null : children
}


// export default function PrivateRoute ({children}:any) {
//     //@ts-ignore
//   const user = JSON.parse(localStorage.getItem("profile"))
//   return user?.user?.user_id ? children : <Navigate to="/"/>
// }