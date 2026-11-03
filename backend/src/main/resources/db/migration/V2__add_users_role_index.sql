-- 访客评论会持续增加 users 记录；统计与管理员初始化均按 role 查询。
CREATE INDEX `users_role_idx` ON `users` (`role`);
