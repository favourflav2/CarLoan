BEGIN TRANSACTION;

-- Create Table Books
create table public.books (
    "bookId" uuid default gen_random_uuid () primary key,
    title text not NULL,
    author text not NULL,
    about text not NULL,
    "haveRead" BOOLEAN not NULL,
    "amazonLink" text not null,
    img text NOT NULL
);

INSERT INTO
    public.books (
        title,
        author,
        about,
        "haveRead",
        "amazonLink",
        img
    )
VALUES (
        'The Little Book of Common Sense Investing',
        'John C. Bogle ',
        'I’ve yet to finish this book, but so far I might have to make it my new #1. Today, especially in this era everyone is talking about investing, everyone is a financial guru. You can look up many articles in recent years and find many lawsuits and cases where people invested their money into the wrong things/people. However, this book gives a clear detailed map on what you have to do. It’s not going to be fast, it’s not going to be sexy, it’s going to be simple. Invest in low cost index funds. I recommend you give this a read.',
        true,
        'https://www.google.com/search?q=common+sense+of+investing',
        'https://contentcreatordatascrape.s3.amazonaws.com/TheLittleBookofCommonSenseInvesting'
    ),
    (
        'The Intelligent Investor',
        'Benjamin Graham',
        '''The greatest investment advisor of the twentieth century, Benjamin Graham, taught and inspired people worldwide. Graham''s philosophy of ''value investing'' -- which shields investors from substantial error and teaches them to develop long-term strategies -- has made The Intelligent Investor the stock market bible ever since its original publication in 1949.'' - Amazon. I haven''t read this book yet but I have heard great things about it ',
        false,
        'https://www.google.com/search?q=amazon+The+Intelligent+Investor',
        'https://contentcreatordatascrape.s3.amazonaws.com/TheIntelligentInvestor'
    ),
    (
        'The Psychology of Money',
        'Morgan Housel ',
        '''Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.'' - Morgan Housel. I haven''t read this book yet but I have heard great things about it ',
        false,
        'https://www.google.com/search?q=amazon+The+Psychology+of+Money',
        'https://contentcreatordatascrape.s3.amazonaws.com/ThePsychologyofMoney'
    ),
    (
        'The Richest Man In Babylon',
        'George S. Clason',
        ' I read this book while i was in college, I got pretty far but wasn''t able to finish the book. However, I believe this book is great because it really simplifies investing. The main concept of this book is to live below your means, save your money and invest. One quote/concept from the book explains just that ... The 7 simple rules of money: 1) Start thy purse to fattening: save money. 2) Control thy expenditures: don’t spend more than you need. 3) Make thy gold multiply: invest wisely. 4) Guard thy treasures from loss: avoid investments that sound too good to be true. 5) Make of thy dwelling a profitable investment: own your home. 6) Ensure a future income: protect yourself with life insurance. 7) Improve thy ability to earn: strive to become wiser and more knowledgeable.',
        true,
        'https://www.google.com/search?q=amazon+the+richest+man+in+babylon',
        'https://contentcreatordatascrape.s3.amazonaws.com/TheRichestManInBabylon'
    ),
    (
        'Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
        'Robert T. Kiyosaki',
        'This is my favorite book I''ve read so far. However, I''ve seen and heard a lot of people bash and criticize the book. One of the most common disputes I hear from this book is that the author Robert Kiyosaki didn''t make his money doing real estate. Another, is that in the portion of the book where he talks about investing in real estate, people have said its not sustainable and or doable for a lot of people. However, for me this book changed my relationship with money and materialistic things. Robert Kiyosaki talked about a concept called the ''Rat Race'', a concept explaining how and why people end up in a endless cycle of getting paid, spending that money, then again waiting for that next check so they can survive. This concept helped me understand that I need to move at my own pace, in order not to fall in the trap of spending and debt. Not updating my lifestyle because that is the trend, because that is was adults do. Instead controlling my destiny/future by not repeating the endless cycle Robert Kiyosaki talks about.',
        true,
        'https://www.google.com/search?q=amazon+rich+dad+poor+dad',
        'https://contentcreatordatascrape.s3.amazonaws.com/RichDadPoorDad:WhattheRichTeachTheirKidsAboutMoneyThatthePoorandMiddleClassDoNot!'
    );

COMMIT;