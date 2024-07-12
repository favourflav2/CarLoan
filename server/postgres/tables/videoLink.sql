BEGIN TRANSACTION;

-- Create Video Link Table
CREATE TABLE public."videoLink" (
    "idVideoLink" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title text NOT NULL,
    link text NOT NULL UNIQUE,
    "aboutVideoLink" text NOT NULL,
    creator text NOT NULL REFERENCES "contentCreator"(name)
);




    INSERT INTO public."videoLink" (title, link, "aboutVideoLink", creator) VALUES
	('Taking Out Two Payday Loans A Month To Survive | Financial Audit', 'https://www.youtube.com/watch?v=c_3FSCN9vFw', 'This is one of my favorite ones when I first started watching Caleb Hammer. This episode had a lot of things that would make anyone scratch their heads. This particular person financed their down payment for a car, meaning they basically have two payments for just one car. However, that''s not it, this person also has a 23.3% interest rate for their car. One can argue that the same APR you find on credit cards.','Caleb Hammer'),
	('27-Year-Old With More Debt Than Anyone Should Ever Have | Financial Audit', 'https://www.youtube.com/watch?v=87qL_bZnAMk', 'This one is one of Caleb''s most view episode, this one is a fun watch. Read the comments you should like this one. ''The IRS got their new favorite podcast'' - @bigpapichampagne745', 'Caleb Hammer'),
	('Why I Don’t Own A House as a Multi-Millionaire…', 'https://www.youtube.com/watch?v=hTy2Vh0GuIQ', 'In this video Ramit gives his take on the rent vs buy scenario, give it a watch.', 'Ramit Sethi'),
	('We’re 2 months from going bankrupt, but I pretend things are fine', 'https://www.youtube.com/watch?v=ZE5jHDWZOMQ', 'This is one of Ramit''s videos that are very similar to Caleb Hammer''s. He has guests on his show, and he try''s to figure out how he can help.','Ramit Sethi'),
	('The Money Expert: ''Do Not Buy A House!'' 10 Ways To Make REAL Money: Ramit Sethi', 'https://www.youtube.com/watch?v=ORqd9QAC8OY&t', 'One of Ramit Sethi''s main topics/ideology is that you don''t have to own your home to be wealthy, skip to 15:00 min and listen to him explain more on that topic. Also you can watch video and he goes in on other topics too.','Ramit Sethi'),
	('The Dumbest Couple I’ve Ever Met | Financial Audit', 'https://www.youtube.com/watch?v=35gHJt89gOo', 'This is a more recent Caleb Hammer video. This whole episode is a trip, I think its a good video to watch because anybody can find themselves in this situation.', 'Caleb Hammer');
COMMIT;