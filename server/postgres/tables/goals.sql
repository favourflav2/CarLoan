BEGIN TRANSACTION;

--  Create Retire Table
CREATE TABLE public.retire (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    creator uuid NOT NULL,
    type character varying(100),
    "currentAge" numeric NOT NULL,
    "retireAge" numeric NOT NULL,
    "lifeExpectancy" numeric,
    savings numeric NOT NULL,
    "monthlyContribution" numeric NOT NULL,
    budget numeric NOT NULL,
    "preRate" numeric NOT NULL,
    "postRate" numeric NOT NULL,
    inflation numeric NOT NULL,
    title character varying(100) NOT NULL,
    "showInputs" boolean NOT NULL,
    date timestamp with time zone NOT NULL,
    CONSTRAINT retire_type_check CHECK (((type)::text = 'Retirement'::text))
);

-- Create Table Car
CREATE TABLE public.car (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    creator uuid NOT NULL,
    name character varying(60) NOT NULL,
    price numeric NOT NULL,
    mileage numeric NOT NULL,
    "downPayment" numeric NOT NULL,
    interest numeric NOT NULL,
    term numeric NOT NULL,
    img text,
    modal character varying(100) NOT NULL,
    type character varying(100),
    "extraPayment" numeric NOT NULL,
    "showInputs" boolean NOT NULL,
    date text NOT NULL,
    CONSTRAINT car_type_check CHECK (((type)::text = 'Car'::text))
);

-- Create Table House
CREATE TABLE public.house (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    creator uuid NOT NULL,
    type character varying(100),
    "streetAddress" character varying(100) NOT NULL,
    price numeric NOT NULL,
    "downPayment" numeric NOT NULL,
    interest numeric NOT NULL,
    term numeric NOT NULL,
    "extraPayment" numeric NOT NULL,
    img text NOT NULL,
    "propertyTax" numeric NOT NULL,
    insurance numeric NOT NULL,
    "mortgageInsurance" numeric NOT NULL,
    appreciation numeric NOT NULL,
    "opportunityCostRate" numeric NOT NULL,
    maintenance numeric NOT NULL,
    "showTax" character varying(100),
    "showInputs" boolean NOT NULL,
    rent numeric NOT NULL,
    "showOppCostInputs" boolean NOT NULL,
    date text NOT NULL,
    CONSTRAINT "house_showTax_check" CHECK (((("showTax")::text = 'monthlyPaymentWithTax'::text) OR (("showTax")::text = 'monthlyPaymentWithNoTax'::text))),
    CONSTRAINT house_type_check CHECK (((type)::text = 'House'::text))
);

COMMIT;