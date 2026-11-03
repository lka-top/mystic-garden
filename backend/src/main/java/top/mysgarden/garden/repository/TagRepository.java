package top.mysgarden.garden.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import top.mysgarden.garden.model.Tag;

public interface TagRepository extends JpaRepository<Tag, Integer> {

    Optional<Tag> findByName(String name);

    Optional<Tag> findBySlug(String slug);

    List<Tag> findAllByOrderByIdAsc();
}
