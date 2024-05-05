import * as React from "react";
import TitleAndBody from "./TitleAndBody";

export interface IFivePercentRuleProps {}

export default function FivePercentRule(props: IFivePercentRuleProps) {
  return (
    <div>
      <TitleAndBody
        header="The 5% Rule ?"
        arrayOfText={[
          {
            index: 0,
            text: (
              <>
                It is not accurate to just compare the rent to mortgage payments. To accurately compare them we need to compare the{" "}
                <span className="font-bold">total non-recoverable costs of renting</span> to the <span className="font-bold">total non-recoverable costs of homeownership</span>.
              </>
            ),
          },
          {
            index: 1,
            text: (
              <>
                <span className="font-bold">A non-recoverable cost refers to an expense that does not yield any residual value</span>. For example if you are renting a building, that rent would be
                considered a non-recoverable cost. Also any utility bills incurred in the course renting the building would also be a non-recoverable cost.
              </>
            ),
          },
          {
            index: 2,
            text: <>For renting, it's simply the amount you pay in rent.</>,
          },
          {
            index: 3,
            text: <>For homeowners, pinpointing these is more challenging.</>,
          },
          {
            index: 4,
            text: (
              <>
                A homeowner has a mortgage payment, which resembles rent and seems like a convenient number to compare. Sadly, it's not that simple. A mortgage payment is not a non-recoverable cost;{" "}
                <span className="font-bold">it comprises both interest and principal repayment</span>.
              </>
            ),
          },
          {
            index: 5,
            text: <>The non-recoverable costs for homeowners include:</>,
          },
          {
            index: 6,
            text: <>1. Property taxes;</>,
          },
          {
            index: 7,
            text: <>2. Maintenance expenses; and</>,
          },
          {
            index: 8,
            text: <>3. The cost of capital.</>,
          },
          {
            index: 9,
            text: (
              <>
                <span className="font-bold">Taxes</span> are relatively easy to grasp for most individuals; they're paid to buy, rent and sell and don't offer any residual value. The average property
                tax in America is 1.10%, while you can see them go all the way to up to 2.2%. 
                <span className="font-bold">This represents the first part of the 5.5% rule that is a little outdated, we will explain the reason for this below</span>. 
              </>
            ),
          },
          {
            index: 10,
            text: (
              <>
                Next, let's consider <span className="font-bold">maintenance costs</span>. These expenses vary widely, from significant undertakings like roof replacements and kitchen renovations, to
                smaller tasks like replacing a garden fence or redecorating a child's room. Estimating a precise figure for maintenance costs can be challenging, and average data on such expenses is
                not readily available.
              </>
            ),
          },
          {
            index: 11,
            text: (
              <>
                However, a common suggestion is to <span className="font-bold">allocate approximately 1% of the property's value per year, on average, to cover maintenance costs</span>.{" "}
                <span className="font-bold">This represents the second part of the 5.5% rule</span>.
              </>
            ),
          },
          {
            index: 12,
            text: (
              <>
                <span className="font-bold">Here comes the cost of capital</span>.
              </>
            ),
          },
          {
            index: 13,
            text: (
              <>
                For most home owners a home is finaced through a mortgage.  Let's consider the example of a new homeowner who makes a 20% down payment and finances the remaining 80% with a mortgage.
                Let’s use $500,000 for the house price, which leaves us with <span className="font-bold">$100,000</span> as the down payment and <span className="font-bold">$400,000</span> as the loan
                amount.
              </>
            ),
          },
          {
            index: 14,
            text: (
              <>
                When you put a down payment on a house, in this case the $100,000 there is an opportunity cost assigned with that. Instead of putting the down payment of $100,000 on the house that
                same money could have been put somewhere else that potentially could have had a higher return.
              </>
            ),
          },
          {
            index: 15,
            text: <>So in order to calculate the cost of capital, we need to first calculate the opportunity cost of the down payment.</>,
          },
          {
            index: 16,
            text: (
              <>
                On average the S&P 500 has an annual return of 7% adjusted with inflation, while historically the average home appreciation is around 2%. The difference between these two is around 5%,
                meaning the stock market is out performing the housing market by 5%.{" "}
                <span className="font-bold">So if we take the down payment of $100,000 * .05 we will get $5,000, and that will be our opportunity cost of the down payment</span>.
              </>
            ),
          },
          {
            index: 17,
            text: (
              <>
                Next, is the second part of the cost of capital equation. This is the cost that the interest payments are costing you a.k.a the cost of debt. We take the loan amount and multiply it by
                the interest rate. For this example let's assume the interest rate on the mortgage is 7%. So we would take <span className="font-bold">$400,000 * .07</span> ={" "}
                <span className="font-bold">$28,000</span>. This will give us a very conservative estimate on figuring out what kind of homes we can afford and some of the costs we cost we don’t get
                back.
              </>
            ),
          },
          {
            index: 17,
            text: (
              <>
                Here is where the 5.5% rule proves to be a little outdated. The 5.5% rule used a 4% mortgage interest rate, however since mortgage rates have increased throughout America it makes
                sense that the 5.5% rule also has to increase.
              </>
            ),
          },
          {
            index: 18,
            text: (
              <>
                Furthermore, we now have everything we need calculate our total cost of capital. We take our <span className="font-bold">$5,000</span> (opportunity cost of the down payment) +{" "}
                <span className="font-bold">$28,000</span> (cost that the interest payments are costing you a.k.a the cost of debt) / <span className="font-bold">$500,000</span> (home value)
              </>
            ),
          },
          {
            index: 19,
            text: (
              <>
                Now we just have to add up all the non-recoverable cost. <span className="font-bold">Property Tax (1.10%)</span>: 1.10% * $500,000 = <span className="font-bold">$5,500</span> …{" "}
                <span className="font-bold">Maint. Cost (1%)</span>: 1% * $500,000 = <span className="font-bold">$5,000</span> … <span className="font-bold">Cost of Capital (6.6%)</span>: $33,000 /
                $500,000 = 6.60% or $500,000 * 6.6% = <span className="font-bold">$33,000</span>
              </>
            ),
          },
          {
            index: 20,
            text: (
              <>
                We get $43,500 for our total non-recoverable costs for homeownership. We then take our total non-recoverable costs for homeownership and divide that by the home value.{" "}
                <span className="font-bold">$43,500 / $500,000 = 8.7%</span>.
              </>
            ),
          },
          {
            index: 21,
            text: (
              <>
                We can use the 8.7% as a quick and easy guideline to see what the cost of homeownership actually is. We simply take the home price and multiply it by 8.7%, then divide it by 12. And
                that value will be the total cost of homeownership on a monthly basis.
              </>
            ),
          },
          {
            index: 22,
            text: (
              <>
              <span className=" italic">~ If this still feels complicated, let me attempt to explain it in a different way. If you take $500,000 cash and buy a house, that money is now tied up in the property instead of being available for other purposes, such as investing in stocks. The differences in expected returns between property and stock represents an opportunity cost. This section/rule is giving you an idea and or a visual representation of the opportunity cost associated with buying a home, especially in this economy and higher mortgage interest rates.</span>

              </>
            ),
          },
        
        ]}
      />
    </div>
  );
}
