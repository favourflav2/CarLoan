BEGIN TRANSACTION;

-- Create Content Creator Table
CREATE TABLE public."contentCreator" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL PRIMARY KEY,
    twitter text,
    instagram text,
    youtube text NOT NULL,
    photo text NOT NULL,
    about text NOT NULL
);




-- Insert Content Craetors
INSERT INTO public."contentCreator" (name, twitter, instagram, youtube, photo, about) VALUES
	('Caleb Hammer', 'https://x.com/sircalebhammer', 'https://www.instagram.com/calebhammercomposer/', 'https://www.youtube.com/c/calebhammer', 'https://contentcreatordatascrape.s3.amazonaws.com/CalebHammer', 'Caleb Hammer has a show where he invites people and goes over their spending and finances. At the end, he tries to develop a plan in which will help said person reach their financial goals. However, a lot of these peoples financial situations are dreadful. His channel is very eye opening, not because he heavily criticizes the people that come on his show but because the people you see on the show can be you, a friend, or even a family member. '),
	('Ramit Sethi', 'https://x.com/ramit', 'https://www.instagram.com/ramit/', 'https://www.youtube.com/@ramitsethi', 'https://contentcreatordatascrape.s3.amazonaws.com/RamitSethi', 'I recently got into Ramit Sethi, he gave me the idea/inspiration into adding the real cost of home ownership into this app. Ramit speaks on many topics dealing with money, and just like Caleb Hammer he has people come on his channel to go over their financial problems. If you went over the real cost of home ownership within this app and didn''t understand it, watch some of his videos.');



COMMIT;