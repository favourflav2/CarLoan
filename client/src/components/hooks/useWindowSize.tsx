import * as React from 'react';



export default function useWindowSize () {
    const [windowSize, setWindowSize] = React.useState([
        window.innerHeight,
        window.innerWidth,
      ]);

      React.useEffect(() => {
        const windowSizeHandler = () => {
          setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener("resize", windowSizeHandler);
    
        return () => {
          window.removeEventListener("resize", windowSizeHandler);
        };
      }, []);
    
 return {
    width: windowSize[1],
    height: windowSize[0]
 }
}
