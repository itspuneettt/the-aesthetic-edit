CREATE TABLE `bag_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bagName` varchar(255) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`season` enum('spring','summer','fall','winter') NOT NULL,
	`budgetTier` varchar(20) NOT NULL,
	`whyCool` text NOT NULL,
	`stylingGuide` text NOT NULL,
	`purchaseLink` text,
	`imageUrl` text,
	`celebrityInspo` json,
	`isBlacklisted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bag_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`season` enum('spring','summer','fall','winter'),
	`budgetTier` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
