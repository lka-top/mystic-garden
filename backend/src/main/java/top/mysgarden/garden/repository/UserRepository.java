package top.mysgarden.garden.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import top.mysgarden.garden.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    Optional<User> findByGuestUuid(String guestUuid);

    Optional<User> findFirstByRoleOrderByIdAsc(String role);

    long countByRole(String role);

    long countByRoleIn(Collection<String> roles);
}
