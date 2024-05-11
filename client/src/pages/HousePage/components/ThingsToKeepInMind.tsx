import * as React from "react";
import TitleAndBody from "./TitleAndBody";

export interface IThingsToKeepInMindProps {}

export default function ThingsToKeepInMind(props: IThingsToKeepInMindProps) {
  return (
    <div>
      <TitleAndBody
        header="Things To Keep In Mind"
        arrayOfText={[
          {
            index: 0,
            text: (
              <>
                The 5% rule is not perfect, it solely relies on the idea that everyone should look at the opportunity cost associated with purchasing a home. And making sure they invested the money
                that they would’ve used to purchase the home. Furthermore, your cost of capital and cost of equity constantly changing due to the fact that your mortgage payments over time decreases
                in interest and increases in the amount you pay in principal. However, this is just an index/idea/concept here to help provide people with a basic understanding of the true cost of
                homeownership. With rising mortgage interest rates and home prices, I believe it’s important to know that there’s more cost associated with owning a home that shouldn’t get overlooked.
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
