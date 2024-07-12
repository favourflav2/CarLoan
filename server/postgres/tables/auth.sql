BEGIN TRANSACTION;

CREATE TABLE public.login (
    id integer NOT NULL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    hash character varying(100) NOT NULL,
    otp character varying(4) DEFAULT NULL::character varying,
    otpexpire timestamp with time zone
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name character varying(51) NOT NULL,
    email character varying(100) NOT NULL,
    joined timestamp without time zone NOT NULL
);
COMMIT;