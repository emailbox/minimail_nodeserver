CREATE TABLE IF NOT EXISTS `f_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emailbox_id` varchar(255) NOT NULL,
  `access_token` text NOT NULL,
  `created` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `emailbox_id` (`emailbox_id`),
  KEY `user_token` (`access_token`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2358 ;
