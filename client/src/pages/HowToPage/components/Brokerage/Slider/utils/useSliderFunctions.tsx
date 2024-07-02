import * as React from "react";
import IndexCard from "../IndexCard";

export interface IuseSliderFunctionsProps {
  index: number;
}

export default function useSliderFunctions({ index }: IuseSliderFunctionsProps) {
  function indexSwitch() {
    switch (index) {
      case 0:
        return (
          <IndexCard
            text="Get a bird's-eye view of how your accounts are doing on our Balances page."
            title="See your accounts at a glance"
            mobile={false}
            buttonText="Open an account"
          />
        );
      case 1:
        return (
          <IndexCard
            text="Keep track of how your portfolio is allocated and get helpful portfolio alerts based on Vanguard's investing philosophy."
            title="A detailed look at your portfolio"
            mobile={false}
            buttonText="Open an account"
          />
        );
      case 2:
        return (
          <IndexCard
            text="Use this page to manage and keep track of your retirement journey."
            title="A snapshot of your retirement savings"
            mobile={false}
            buttonText="Open an account"
          />
        );
      case 3:
        return (
          <IndexCard
            text="Our Buy & sell page allows you to easily access trade paths to all the products your Vanguard account can hold."
            title="One page for your trading needs"
            mobile={false}
            buttonText="Open an account"
          />
        );
      case 4:
        return (
          <IndexCard
            text="Set up automatic investments, banking information, beneficiaries, and more to keep your profile information up to date."
            title="Easily manage your profile preferences"
            mobile={false}
            buttonText="Open an account"
          />
        );
      case 5:
        return (
          <IndexCard
            text="With a few taps, you can review your account balances, place trades, and manage your Vanguard profile."
            title="Your portfolio at your fingertips"
            mobile={true}
            buttonText="See mobile app benefits"
          />
        );
      default:
        return;
    }
  }
  return {
    indexSwitch,
  };
}
