package top.mysgarden.garden.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import top.mysgarden.garden.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findBySlug(String slug);

    Optional<Category> findByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
