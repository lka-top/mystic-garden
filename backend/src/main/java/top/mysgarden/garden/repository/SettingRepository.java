package top.mysgarden.garden.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import top.mysgarden.garden.model.Setting;

public interface SettingRepository extends JpaRepository<Setting, String> {
}
