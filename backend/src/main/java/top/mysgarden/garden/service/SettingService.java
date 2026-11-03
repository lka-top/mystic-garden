package top.mysgarden.garden.service;

import java.util.LinkedHashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.model.Setting;
import top.mysgarden.garden.repository.SettingRepository;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;

    @Transactional(readOnly = true)
    public Map<String, String> getAllSettings() {
        Map<String, String> map = new LinkedHashMap<>();
        for (Setting setting : settingRepository.findAll()) {
            map.put(setting.getKey(), setting.getValue());
        }
        return map;
    }

    @Transactional
    public Map<String, Object> updateSettings(Map<String, Object> payload) {
        if (payload == null) {
            throw BusinessException.badRequest("无效的设置参数");
        }
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            String key = entry.getKey();
            if (key == null || key.isBlank() || key.length() > 50) {
                throw BusinessException.badRequest("无效的设置键名");
            }
            String value = entry.getValue() != null ? String.valueOf(entry.getValue()) : "";
            Setting setting = settingRepository.findById(key).orElseGet(() -> {
                Setting created = new Setting();
                created.setKey(key);
                return created;
            });
            setting.setValue(value);
            settingRepository.save(setting);
        }
        return payload;
    }
}
