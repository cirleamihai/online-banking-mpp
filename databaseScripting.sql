use online_banking;

select * from purchases;
select * from creditCards order by placeHolder desc;
select count(*) from creditCards;



create table users (
    id varchar(255) primary key,
    username varchar(255),
    passwordHash varchar(255),
    email varchar(255),
	accessRole varchar(255) check (accessRole in ('user', 'admin', 'manager'))
);

create table creditCards (
	id varchar(255) primary key,
	title varchar(255),
	cardType varchar(255) check (cardType in ('Visa', 'MasterCard')),
	placeHolder varchar(255),
	cardNumber varchar(23) unique,
	expiryMo int,
	expiryYr int,
	cvv varchar(3),
	userId varchar(255) foreign key references users(id)
);


create table purchases (
	id varchar(255) primary key,
	totalValue int,
	merchant varchar(255),
	cardID varchar(255) foreign key references creditCards(id)
);

delete from purchases;
delete from creditCards;
delete from users;

drop table purchases;
drop table creditCards;
drop table users;


insert into users values ('4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad', 'admin', '$2a$10$oKWIEyW1Wz6rWRCCi93TVefKqF4PpxetQABAtYyrmWAptaCv49Ia6', 'admin@gmail.com', 'admin'),
    ('858a71de-86db-48fa-8d18-767b63c9dfc0', 'cirlea mihai', '$2a$10$yCqvkFooftmiZxs40GmvoOVQ43OThsnp0xjX/2KYXSzQClgLXyBCm', 'alexcirlea@gmail.com', 'user'),
    ('cf1f173e-7341-4568-be24-ad1401e06749', 'alice johnson', '$2a$10$qiWh9/cL.RV7mrpP0pz9uuyRNbUcpvxWJcU8JzY8aFrFQQ8eOr4Ja', 'alicejohnson@gmail.com', 'manager');

INSERT INTO creditCards (id, title, cardType, placeHolder, cardNumber, expiryMo, expiryYr, cvv, userId) VALUES
('273eb572-de9f-4b27-8d74-8f9a95643c53', 'MyCard', 'Visa', 'Emanuel Rodrigo', '1234 5678 9101 1121', 1, 23, '745', '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'),
('996bf9ec-1f4c-46ce-888d-837f9cef37e6', 'Daniels Card', 'MasterCard', 'Daniel Oluwaseun', '9821 5678 0111 0222', 9, 24, '123', '858a71de-86db-48fa-8d18-767b63c9dfc0'),
('6ce6d63b-b5f1-4f4d-96d9-261f74146355', 'Travel Plus', 'MasterCard', 'Sam Dingo', '3344 5566 7788 9900', 12, 25, '678', '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'),
('ebd75d6e-01af-447f-8c2f-2b4a48040f4c', 'Business Exp', 'Visa', 'Josh Buaca', '4557 6655 8912 0022', 6, 26, '432', '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'),
('a572a86c-5bf8-44f0-906a-5cccd04bff45', 'Grocery Saver', 'MasterCard', 'Tino Dabossa', '9988 7766 5544 3322', 3, 27, '221', '858a71de-86db-48fa-8d18-767b63c9dfc0'),
('e0904a43-c243-411e-8654-a64f354e1179', 'Shopping Rewards', 'Visa', 'Alice Johnson', '1122 3344 5566 7788', 5, 28, '987', '858a71de-86db-48fa-8d18-767b63c9dfc0'),
('74c640e6-32f6-44ab-ad8c-b5ce48e458ca', 'Family Expenses', 'MasterCard', 'Michael Smith', '5432 1098 7654 3210', 11, 29, '456', '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'),
('4d19b271-192a-4685-8635-ccd9fa3e40c4', 'Travel Rewards', 'Visa', 'Emily Davis', '7654 3210 9876 5432', 8, 30, '789', '858a71de-86db-48fa-8d18-767b63c9dfc0'),
('b5ec11c9-fab0-4eee-8d02-d9420c7d7ee6', 'Online Purchases', 'MasterCard', 'John Anderson', '0987 6543 2109 8765', 2, 31, '234', '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'),
('592d67a5-4fc0-4745-a0b3-3a2ceec651b2', 'Emergency Fund', 'Visa', 'Sarah Williams', '1111 2222 3333 4444', 7, 32, '567', 'cf1f173e-7341-4568-be24-ad1401e06749'),
('25794adf-e018-41d6-b813-3bbe94352711', 'Business Travel', 'MasterCard', 'Robert Brown', '2222 3333 4444 5555', 10, 33, '890', 'cf1f173e-7341-4568-be24-ad1401e06749'),
('ee929e09-f965-41d3-a78f-3bed2a218642', 'Charity Donations', 'Visa', 'Jessica Lee', '3333 4444 5555 6666', 4, 34, '123', '858a71de-86db-48fa-8d18-767b63c9dfc0'),
('a5dcde9e-803f-44e5-84b0-d0963efbec1c', 'Entertainment', 'MasterCard', 'David Wilson', '4444 5555 6666 7777', 1, 35, '456', 'cf1f173e-7341-4568-be24-ad1401e06749'),
('4cce72c1-5a1b-4b85-a0eb-ed518f70bd16', 'Personal Savings', 'Visa', 'Jennifer Martinez', '5555 6666 7777 8888', 9, 36, '789', 'cf1f173e-7341-4568-be24-ad1401e06749'),
('2604306c-a761-4fd5-8b82-188d7d15cada', 'Vacation Fund', 'MasterCard', 'Christopher Taylor', '6666 7777 8888 9999', 12, 37, '012', 'cf1f173e-7341-4568-be24-ad1401e06749');

INSERT INTO purchases (id, totalValue, merchant, cardID) VALUES
('831fc5c2-8e50-413c-a3d6-07c2b0fccc00', 150, 'Amazon', '592d67a5-4fc0-4745-a0b3-3a2ceec651b2'),
('9a52be5d-5d7c-4eb3-98a6-370872f922b4', 200, 'Walmart', '6ce6d63b-b5f1-4f4d-96d9-261f74146355'),
('f87db6f4-1847-4385-a47e-6b3f3581b370', 320, 'Best Buy', '25794adf-e018-41d6-b813-3bbe94352711'),
('51a6155c-e261-4100-a65d-dad6b0f913cb', 450, 'Target', '74c640e6-32f6-44ab-ad8c-b5ce48e458ca'),
('99c38c84-994a-41cf-a658-0870693ea3a9', 85, 'Whole Foods', 'ebd75d6e-01af-447f-8c2f-2b4a48040f4c'),
('5c742bcf-23ea-465c-98f1-bb727daa0a4b', 125, 'Etsy', 'a5dcde9e-803f-44e5-84b0-d0963efbec1c'),
('d875a320-4bcc-4129-98c5-d11352ce135e', 60, 'Starbucks', '273eb572-de9f-4b27-8d74-8f9a95643c53'),
('780dccd4-92dc-468f-be27-a8909025dd71', 230, 'Costco', '996bf9ec-1f4c-46ce-888d-837f9cef37e6'),
('aab72ffa-3d1d-4e01-8187-e5156ac7108e', 90, 'Uber Eats', 'e0904a43-c243-411e-8654-a64f354e1179'),
('0941f0c7-704c-4c7b-b528-1a30be073ce2', 500, 'Apple Store', '2604306c-a761-4fd5-8b82-188d7d15cada');


-- VIEWS -> REALLY IMPORTANT
create or alter view UserCardsUsageView as
SELECT
    cc.id,
    cc.title,
    cc.cardType,
    cc.placeHolder,
    cc.cardNumber,
    cc.expiryMo,
    cc.expiryYr,
    cc.cvv,
	cc.userId,
    COUNT(p.id) AS UsageCount  -- Count of related entries in 'purchases'
FROM
    creditCards cc
LEFT JOIN
    purchases p ON p.cardID = cc.id
GROUP BY
    cc.id,
    cc.title,
    cc.cardType,
    cc.placeHolder,
    cc.cardNumber,
    cc.expiryMo,
    cc.expiryYr,
    cc.cvv,
	cc.userId;


-- VIEW with userID attached
create or alter view userPurchasesView as
SELECT p.*, c.cardNumber, c.userId FROM purchases p inner join creditCards c on p.cardID = c.id;

select * from userPurchasesView


-- VIEW with userID attached
create or alter view usersCards as
select u.username, c.title, c.cardType, c.placeHolder, c.cardNumber, c.expiryMo, c.expiryYr, c.cvv
from users u
inner join creditCards c on u.id = c.userId;

select * from usersCards


-- procedure the get all the User Cards based on an ID
create or alter procedure getUserCards
	@id varchar(255),
    @limit INT = 10, -- Default value for limit
    @offset INT = 0  -- Default value for offset
as
begin
    select c.id, c.title, c.cardType, c.placeHolder, c.cardNumber, c.expiryMo, c.expiryYr, c.cvv, c.UsageCount
    from UserCardsUsageView c
    where c.userId = @id
	order by c.userId
	OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY;
end;

exec getUserCards '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'

select * from users

delete from users where id='ffdb4a5a-72f7-4ad1-9892-67392f096505'

-- procedure to get all the user Purchases based on an ID
create or alter procedure getUserPurchases
	@id varchar(255),
    @limit INT = 10, -- Default value for limit
    @offset INT = 0  -- Default value for offset
as 
begin
	select p.id, p.totalValue, p.merchant, p.cardID, p.cardNumber
	from userPurchasesView p
	where p.userId = @id
	order by p.userId
	OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY;
end;

exec getUserPurchases '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'