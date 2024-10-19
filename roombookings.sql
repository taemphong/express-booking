-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: roombookings
-- ------------------------------------------------------
-- Server version	9.0.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_history`
--

DROP TABLE IF EXISTS `booking_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `action_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `performed_by` int NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `booking_id` (`booking_id`),
  KEY `performed_by` (`performed_by`),
  CONSTRAINT `booking_history_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `meeting_room_booking` (`booking_id`),
  CONSTRAINT `booking_history_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `login` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_history`
--

LOCK TABLES `booking_history` WRITE;
/*!40000 ALTER TABLE `booking_history` DISABLE KEYS */;
INSERT INTO `booking_history` VALUES (7,26,'created','2024-10-13 10:48:13',77),(8,27,'created','2024-10-13 16:26:19',77),(10,30,'created','2024-10-18 16:25:51',77);
/*!40000 ALTER TABLE `booking_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `confirmation_code` varchar(255) DEFAULT NULL,
  `code_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (11,'wave123','สรเดช','เกืดสมบูรณ์','wabesad@ku.th','e10adc3949ba59abbe56e057f20f883e','2024-09-05 15:47:39',NULL,NULL,1,'admin1','IT2','1234567890',NULL,NULL),(12,'johndoe','John','Doe','johndoe@example.com','e10adc3949ba59abbe56e057f20f883e','2024-09-10 09:37:39','2024-09-10 09:37:39',NULL,1,'user','Engineering','123-456-7890',NULL,NULL),(13,'johndoe2','John2','Doe2','johndoe@example.com2','fcea920f7412b5da7be0cf42b8c93759','2024-09-10 09:41:05','2024-09-10 09:41:05',NULL,1,'user','Engineering1','123-456-78901',NULL,NULL),(14,'john54doe2','John3','Doe4','johndoe@e54564xample.com2','25f9e794323b453885f5181f1b624d0b','2024-09-10 10:17:47','2024-09-10 10:17:47',NULL,1,'user','Engineering1','123-456-78901',NULL,NULL),(15,'joasxcc4doe2','John3','Doe4','johndoe@xce54564xample.com2','25f9e794323b453885f5181f1b624d0b','2024-09-10 19:01:45','2024-09-10 19:01:45',NULL,1,'user','Engineering1','123-456-78901',NULL,NULL),(18,'wave1','สรเดช','Doe4','johหกดndoe@xce54564xample.com2','25f9e794323b453885f5181f1b624d0b','2024-09-12 18:01:23','2024-09-12 18:01:23',NULL,1,'user','Engineering1','123-456-78901',NULL,NULL),(19,'johsdffdndoe','wave','Doe','johndodsfvvce@example.com','482c811da5d5b4bc6d497ffa98491e38','2024-09-19 16:38:18','2024-09-19 16:38:18',NULL,1,'user','IT','123456789',NULL,NULL),(20,'sfcvxcv','admin','admin','johndodsdfvvce@example.com','fe01d42aec5116b4d25c32fb02682383','2024-09-19 16:39:37','2024-09-19 16:39:37',NULL,1,'user','IT1','123456789',NULL,NULL),(22,'aaaaaaaaa','asdasd','admin','tttt@example.com','fe01d42aec5116b4d25c32fb02682383','2024-09-19 16:49:25','2024-09-19 16:49:25',NULL,1,NULL,'IT1','123456789',NULL,NULL),(23,'bbbbb','asdasd','admin','tttyt@example.com','fe01d42aec5116b4d25c32fb02682383','2024-09-19 16:51:26','2024-09-19 16:51:26',NULL,1,'user','IT1','123456789',NULL,NULL),(24,'kuthee','John','Doe','tytyn@example.com','482c811da5d5b4bc6d497ffa98491e38','2024-09-19 16:52:00','2024-09-19 16:52:00',NULL,1,'admin','IT','123456789',NULL,NULL),(25,'[object Object]','undefined','undefined','undefined','undefined','2024-09-19 17:25:15','2024-09-19 17:25:15',NULL,1,'user','undefined','undefined',NULL,NULL),(40,'saxv','sdf','sdf','dfsvv@example.com','482c811da5d5b4bc6d497ffa98491e38','2024-09-19 17:42:46','2024-09-19 17:42:46',NULL,1,'user','IT','123456789',NULL,NULL),(43,'safcbghbxv','sdf','sdf','dfgbjjg@example.com','482c811da5d5b4bc6d497ffa98491e38','2024-09-19 17:43:39','2024-09-19 17:43:39',NULL,1,'admin','IT','123456789',NULL,NULL),(44,'asdasd','asdasd','asda','wasdawasgas','60c90a87a7a4809fedd0401357a29379','2024-09-19 17:57:13','2024-09-19 17:57:13',NULL,1,'user','aad',NULL,NULL,NULL),(51,'sssss','ssssssss','sssssss','ssssssssgg','71bde74ce7d8b2c826ec56224842697f','2024-09-19 17:58:40','2024-09-19 17:58:40',NULL,1,'user','aab1','',NULL,NULL),(52,'zzzzz','zzzzzz','zzzzz','zzzzzzzzff','71bde74ce7d8b2c826ec56224842697f','2024-09-19 17:59:25','2024-09-19 17:59:25',NULL,1,'user','aab1','12345',NULL,NULL),(53,'zzzz','zzzz','zzzz','zzzz','02c425157ecd32f259548b33402ff6d3','2024-09-19 18:02:10','2024-09-19 18:02:10',NULL,1,'user','zzzz','zzzz',NULL,NULL),(55,'aa','aa','aa','aa','4124bc0a9335c27f086f24ba207a4912','2024-09-19 18:07:56','2024-09-19 18:07:56',NULL,1,'user','aa','aa',NULL,NULL),(74,'boat789','taemphong','sophonsuwaphap','myboatnkpt123@gmail.com','68053af2923e00204c3ca7c6a3150cf7','2024-09-21 08:46:53','2024-09-30 17:57:30',NULL,1,'admin','itsupport','0925655555',NULL,NULL),(75,'wave12','asd','asdasd','asdasd','c20ad4d76fe97759aa27a0c99bff6710','2024-09-24 16:43:44','2024-09-24 16:43:44',NULL,1,'user','asdasd','9999999',NULL,NULL),(76,'adminboat','taemphong','sophonsuwaphap','myboatnkpt@gmail.com','e10adc3949ba59abbe56e057f20f883e','2024-10-01 17:29:18','2024-10-09 15:27:47',NULL,1,'admin','adminRoombooking','0925655555','fe0772d8','2024-10-09 22:42:48'),(77,'userboat','taemphong','sophonsuwaphap','boatseed159@gmail.com','49a8ccd759bd2ca569d622e662717bfd','2024-10-04 17:19:33','2024-10-18 15:42:03',NULL,1,'user','userRoombooking','0925655555','ab6365','2024-10-18 22:57:03'),(79,'user','taemphong','sophnsuwaphap','tsetmyboatnkpt@gmail.com','5bf9f926d1b43c982eed54773b05856b','2024-10-18 18:06:06','2024-10-18 18:06:06',NULL,1,'user','IT','0925655551',NULL,NULL);
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) NOT NULL,
  `capacity` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `amenities` text,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `room_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_room`
--

LOCK TABLES `meeting_room` WRITE;
/*!40000 ALTER TABLE `meeting_room` DISABLE KEYS */;
INSERT INTO `meeting_room` VALUES (1,'Updated Room Name',15,'Updated Location','Updated Amenities',0,'2024-09-05 12:40:54','2024-09-05 12:49:09',NULL),(2,'Meeting Room B',10,'Building A, 2nd Floor','Projector, Whiteboard',1,'2024-09-05 12:42:00','2024-09-05 12:42:00',NULL),(4,'Conference A',30,'3rd Floor','Projector, Whiteboard',1,'2024-09-10 19:41:49','2024-09-10 19:50:18',NULL),(5,'ห้องประชุม A',10,'ชั้น 1','WiFi, โปรเจคเตอร์',1,'2024-09-21 11:09:18','2024-09-21 11:09:18',NULL),(6,'asd',30,'asd','asd',1,'2024-09-21 12:22:45','2024-09-21 12:22:45','uploads\\file-1726921365608-248330175'),(7,'asd',30,'asd','asd',1,'2024-09-21 12:26:18','2024-09-21 12:26:18','uploads\\room.JPG'),(8,'asd',30,'asd','asd',1,'2024-09-21 12:48:56','2024-09-21 12:48:56','uploads\\room.JPG'),(9,'sc100fdasd',10,'kamphansadesdfzxc','projectordfszxc',0,'2024-09-21 12:53:46','2024-09-27 11:56:17','uploads\\room.JPG'),(14,'SC9',100,'เกษตรศาสตร์','WI-FI',1,'2024-10-18 18:48:23','2024-10-18 18:48:23','uploads\\room4.jpg');
/*!40000 ALTER TABLE `meeting_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_room_booking`
--

DROP TABLE IF EXISTS `meeting_room_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_room_booking` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `purpose` text,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `meeting_room_booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`),
  CONSTRAINT `meeting_room_booking_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `meeting_room` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_room_booking`
--

LOCK TABLES `meeting_room_booking` WRITE;
/*!40000 ALTER TABLE `meeting_room_booking` DISABLE KEYS */;
INSERT INTO `meeting_room_booking` VALUES (2,11,1,'2024-10-05','18:00:00','19:00:00','testedit','cancel','2024-09-12 17:45:28','2024-10-18 19:03:34'),(26,77,9,'2024-09-25','19:00:00','20:00:00','Team Meeting','cancel','2024-10-13 10:48:13','2024-10-18 16:13:45'),(27,77,1,'2024-10-05','10:00:00','11:00:00','testedit','confirm','2024-10-13 16:26:19','2024-10-18 19:05:01'),(30,77,4,'2024-09-25','19:00:00','20:00:00','Team Meeting','pending','2024-10-18 16:25:51','2024-10-18 16:25:51');
/*!40000 ALTER TABLE `meeting_room_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_room_details`
--

DROP TABLE IF EXISTS `meeting_room_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_room_details` (
  `detail_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`detail_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `meeting_room_details_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `meeting_room` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_room_details`
--

LOCK TABLES `meeting_room_details` WRITE;
/*!40000 ALTER TABLE `meeting_room_details` DISABLE KEYS */;
INSERT INTO `meeting_room_details` VALUES (1,9,'uploadDetail\\room4.jpg','testupdate'),(2,9,'uploadDetail\\room6.jpg','testdescription'),(3,9,'uploadDetail\\room5.jpg','testdescription');
/*!40000 ALTER TABLE `meeting_room_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_announcements`
--

DROP TABLE IF EXISTS `news_announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_announcements` (
  `news_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `author_name` varchar(255) NOT NULL,
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_announcements`
--

LOCK TABLES `news_announcements` WRITE;
/*!40000 ALTER TABLE `news_announcements` DISABLE KEYS */;
INSERT INTO `news_announcements` VALUES (3,'New Announcement Title','This is the content of the news announcement.','2024-09-14 07:41:26','2024-09-14 07:41:26','2024-09-14',1,''),(4,'New Announcement','This is the content of the news announcement.','2024-10-01 07:53:31','2024-10-01 07:56:32','2024-10-01',1,'boat'),(5,'หยุด 2 วัน','เนื่องในวันออกพรรษา','2024-10-18 18:42:06','2024-10-18 18:42:06','2024-10-19',1,'adminboat');
/*!40000 ALTER TABLE `news_announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `booking_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`),
  CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `meeting_room_booking` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'roombookings'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-19 19:13:57
