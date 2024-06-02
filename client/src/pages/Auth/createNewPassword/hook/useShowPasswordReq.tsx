import * as React from 'react';

export interface IuseShowPasswordReqProps {
    errorKeys: string[]
}

export default function useShowPasswordReq ({errorKeys}: IuseShowPasswordReqProps) {

  // Hide validation
  const [hideVal, setHideVal] = React.useState(true);

  React.useEffect(() => {
    if (errorKeys.length <= 0 || !errorKeys.includes("password")) {
      setHideVal(true);
    } else if (errorKeys.includes("password")) {
      setHideVal(false);
    }
  }, [errorKeys]);
  
  return {
    hideVal,
    setHideVal
  }
}
