import * as React from 'react';
import TitleAndBody from './TitleAndBody';


export interface IHelpTextProps {
}

export default function HelpText (props: IHelpTextProps) {
  return (
    <div>
    <TitleAndBody
       header="Owning vs Renting"
       arrayOfText={[
         {
           index: 0,
           text: (
             <>
              If this still feels complicated, let me attempt to explain it in a different way. If you take $500,000 cash and buy a house, that money is now tied up in the property instead of being available for other purposes, such as investing in stocks. The differences in expected returns between property and stock represents an opportunity cost. This section/rule is giving you an idea and or a visual representation of the opportunity cost associated with buying a home, especially in this economy and higher moorage interest rates.
             </>
           ),
         },
       ]}
     />
 </div>
  );
}
