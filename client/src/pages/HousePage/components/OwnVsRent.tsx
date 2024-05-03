import * as React from 'react';
import TitleAndBody from './TitleAndBody';

export interface IOwnVsRentProps {
}

export default function OwnVsRent (props: IOwnVsRentProps) {
  return (
    <div>
       <TitleAndBody
          header="Owning vs Renting"
          arrayOfText={[
            {
              index: 0,
              text: (
                <>
                  The 5% rule was invented by Ben Felix, a portfolio manager at PWL Capital based in Canada. This rule is aimed to help assess the rent vs buy decision in real estate industry. Buying
                  or renting is such a hard decisions among potential home buyers. The up and down sides of both renting and buying will be discussed further. However, since mortgage rates are ever
                  changing the 5% rule currently is now outdated. Within this section I hope I can explain the reason to which it is outdated and also show you the differences between renting and
                  buying a house.
                </>
              ),
            },
          ]}
        />
    </div>
  );
}
