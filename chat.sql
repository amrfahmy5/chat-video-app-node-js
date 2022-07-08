-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2022 at 05:53 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `message_id` int(200) NOT NULL,
  `sender_id` int(200) NOT NULL,
  `receiver_id` int(200) NOT NULL,
  `message_content` varchar(500) DEFAULT NULL,
  `isReaded` tinyint(1) NOT NULL DEFAULT 0,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `readMessageDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`message_id`, `sender_id`, `receiver_id`, `message_content`, `isReaded`, `created_time`, `readMessageDate`) VALUES
(1, 1, 2, 'hello ahmed', 1, '2022-07-05 14:46:43', '2022-07-08 15:34:52'),
(2, 2, 1, 'a yasta?', 1, '2022-07-05 14:46:52', '2022-07-08 15:34:41'),
(3, 1, 2, 'a yasta', 1, '2022-07-05 14:50:19', '2022-07-08 15:34:52'),
(4, 2, 1, 'fe a', 1, '2022-07-05 14:50:38', '2022-07-08 15:34:41'),
(5, 1, 2, '?', 1, '2022-07-05 14:51:36', '2022-07-08 15:34:52'),
(6, 1, 2, 'me4 fahm 7aga', 1, '2022-07-05 14:51:44', '2022-07-08 15:34:52'),
(7, 1, 2, 'tani?', 1, '2022-07-05 14:51:56', '2022-07-08 15:34:52'),
(8, 2, 1, 'hhhhhhhhhhh', 1, '2022-07-05 14:52:01', '2022-07-08 15:34:41'),
(9, 1, 2, 'a yasta', 1, '2022-07-05 14:52:23', '2022-07-08 15:34:52'),
(10, 1, 2, '\nfe a', 1, '2022-07-05 14:52:24', '2022-07-08 15:34:52'),
(11, 1, 2, 'A YASTA', 1, '2022-07-05 14:56:19', '2022-07-08 15:34:52'),
(12, 2, 0, 'a yasta', 0, '2022-07-05 15:01:31', '2022-07-05 15:01:31'),
(13, 1, 0, 'a ya negm', 0, '2022-07-05 15:01:35', '2022-07-05 15:01:35'),
(14, 2, 1, 'hello', 1, '2022-07-05 15:21:24', '2022-07-08 15:34:41'),
(15, 2, 1, 'a', 1, '2022-07-05 15:22:10', '2022-07-08 15:34:41'),
(16, 2, 1, 'hello', 1, '2022-07-05 15:23:44', '2022-07-08 15:34:41'),
(17, 1, 2, 'yasta', 1, '2022-07-05 15:25:11', '2022-07-08 15:34:52'),
(18, 2, 1, 'a yasta', 1, '2022-07-05 15:25:16', '2022-07-08 15:34:41'),
(19, 1, 2, 'hello', 1, '2022-07-08 14:05:07', '2022-07-08 15:34:52'),
(20, 1, 2, 'a yasta', 1, '2022-07-08 14:06:19', '2022-07-08 15:34:52'),
(21, 2, 1, 'fe a', 1, '2022-07-08 14:06:26', '2022-07-08 15:34:41'),
(22, 2, 1, 'mfe4 7aga', 1, '2022-07-08 14:06:34', '2022-07-08 15:34:41'),
(23, 1, 2, 'hello from amr', 1, '2022-07-08 14:08:35', '2022-07-08 15:34:52'),
(24, 2, 1, 'hello ahmed', 1, '2022-07-08 14:08:44', '2022-07-08 15:34:41'),
(25, 1, 2, 'fe 7aga?\n', 1, '2022-07-08 14:08:50', '2022-07-08 15:34:52'),
(26, 2, 1, 'hello\n', 1, '2022-07-08 14:08:56', '2022-07-08 15:34:41'),
(27, 1, 2, '\nhello', 1, '2022-07-08 14:08:59', '2022-07-08 15:34:52'),
(28, 1, 2, 'hello', 1, '2022-07-08 14:10:22', '2022-07-08 15:34:52'),
(29, 2, 1, '?', 1, '2022-07-08 14:11:23', '2022-07-08 15:34:41'),
(30, 1, 2, 'a', 1, '2022-07-08 14:11:26', '2022-07-08 15:34:52'),
(31, 2, 1, 'hello', 1, '2022-07-08 14:12:00', '2022-07-08 15:34:41'),
(32, 1, 2, 'a yasta', 1, '2022-07-08 14:12:02', '2022-07-08 15:34:52'),
(33, 1, 2, '?', 1, '2022-07-08 14:37:50', '2022-07-08 15:34:52'),
(34, 2, 1, 'tmam?', 1, '2022-07-08 14:38:01', '2022-07-08 15:34:41'),
(35, 1, 2, 'a yasta', 1, '2022-07-08 15:05:49', '2022-07-08 15:34:52'),
(36, 2, 1, 'tmam', 1, '2022-07-08 15:34:35', '2022-07-08 15:34:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `img_src` varchar(500) DEFAULT NULL,
  `online` tinyint(1) NOT NULL DEFAULT 0,
  `lastOnlineDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `img_src`, `online`, `lastOnlineDate`) VALUES
(0, 'Public Group', '000000', '/img/avatar3.png', 1, '2022-07-04 16:45:43'),
(1, 'amr', '123456', '/img/avatar.png', 1, '2022-07-08 15:32:48'),
(2, 'ahmed', '123456', '/img/avatar1.png', 1, '2022-07-08 15:30:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `message_id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
