CREATE DATABASE  IF NOT EXISTS `api1` ;
USE `api1`;

DROP TABLE IF EXISTS `puntuacion`;
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `coments`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dia_registro` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);




CREATE TABLE `coments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
);




CREATE TABLE `likes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned DEFAULT NULL,
  `fotoId` int unsigned DEFAULT NULL,
  `dia_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `fotoId` (`fotoId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`fotoId`) REFERENCES `coments` (`id`)
) ;







CREATE TABLE `puntuaciones` (
  `idpuntuaciones` int unsigned NOT NULL AUTO_INCREMENT,
  `puntuacion` int unsigned DEFAULT NULL,
  `intentos` int unsigned DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `ultima` tinyint(1) DEFAULT NULL,
  `tiempo` varchar(255) DEFAULT NULL,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpuntuaciones`)

) ;