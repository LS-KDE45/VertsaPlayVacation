-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           11.5.2-MariaDB - mariadb.org binary distribution
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para vertsaplayvacation
CREATE DATABASE IF NOT EXISTS `vertsaplayvacation` /*!40100 DEFAULT CHARACTER SET armscii8 COLLATE armscii8_bin */;
USE `vertsaplayvacation`;

-- A despejar estrutura para tabela vertsaplayvacation.utilizadores
CREATE TABLE IF NOT EXISTS `utilizadores` (
  `Utilizador_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Utilizador_email` varchar(255) NOT NULL DEFAULT '',
  `Utilizador_nome` varchar(255) NOT NULL DEFAULT '',
  `Utilizador_telemovel` int(9) DEFAULT NULL,
  `Utilizador_cargo` varchar(255) NOT NULL DEFAULT '',
  `Utilizador_senha` varchar(255) NOT NULL DEFAULT '',
  `Utilizador_tipo` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Utilizador_ID`) USING BTREE,
  UNIQUE KEY `Utilizador_email` (`Utilizador_email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- A despejar dados para tabela vertsaplayvacation.utilizadores: ~1 rows (aproximadamente)
DELETE FROM `utilizadores`;
INSERT INTO `utilizadores` (`Utilizador_ID`, `Utilizador_email`, `Utilizador_nome`, `Utilizador_telemovel`, `Utilizador_cargo`, `Utilizador_senha`, `Utilizador_tipo`) VALUES
	(1, 'admin@gmail.com', 'admin', NULL, 'admin', '$2a$10$WLFoGG/7oHx2pUbbHpGPXu8Y/0F9CfaipfCV1ky/uaAjazWFMTPia', 1);

-- A despejar estrutura para tabela vertsaplayvacation.ferias
CREATE TABLE IF NOT EXISTS `ferias` (
  `Ferias_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Utilizador_ID` int(11) NOT NULL,
  `Ferias_data_inicio` date NOT NULL,
  `Ferias_data_fim` date NOT NULL,
  PRIMARY KEY (`Ferias_ID`),
  KEY `FK_Ferias_Utilizadores` (`Utilizador_ID`),
  CONSTRAINT `FK_Ferias_Utilizadores` FOREIGN KEY (`Utilizador_ID`) REFERENCES `utilizadores` (`Utilizador_ID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
