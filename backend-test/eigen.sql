/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.5.5-10.4.14-MariaDB : Database - eigen
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`eigen` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `eigen`;

/*Table structure for table `books` */

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books` (
  `id` varchar(36) NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `books` */

insert  into `books`(`id`,`code`,`title`,`author`,`stock`) values ('3098ed51-7d21-46f0-9375-1c887bbb7b71','TW-11','Twilight','Stephenie Meyer',1),('53ae66a0-cff6-4fdf-a458-43da4e1f83cd','SHR-1','A Study in Scarlet','Arthur Conan Doyle',1),('6b96dff4-dfec-4373-946b-2db816e7e6a4','NRN-7','The Lion, the Witch and the Wardrobe','C.S. Lewis',1),('c5893cd1-9597-419e-8a57-54731d137d54','JK-45','Harry Potter','J.K Rowling',1),('e672a2ba-3796-4f99-b401-50c8344ee511','HOB-83','The Hobbit, or There and Back Again','J.R.R. Tolkien',1);

/*Table structure for table `members` */

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
  `id` varchar(36) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `penaltyUntil` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `members` */

insert  into `members`(`id`,`code`,`name`,`penaltyUntil`) values ('41f88a19-c877-4f5e-845d-ceced8da7579','M001','Angga',NULL),('4373edb2-3e7a-4927-aba7-ecac986bd6e1','M002','Ferry',NULL),('ed4c173b-b0b1-430c-8428-ff60bd9c3af6','M003','Putri',NULL);

/*Table structure for table `transactions` */

DROP TABLE IF EXISTS `transactions`;

CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `bookId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `expiredAt` datetime DEFAULT NULL,
  `returnDate` datetime DEFAULT NULL,
  `status` enum('LOAN','RETURN') NOT NULL DEFAULT 'LOAN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `transactions` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
