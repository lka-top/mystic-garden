package top.mysgarden.garden.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import top.mysgarden.garden.model.Notebook;

public interface NotebookRepository extends JpaRepository<Notebook, Integer> {

    Optional<Notebook> findBySlug(String slug);

    Optional<Notebook> findByPath(String path);

    boolean existsBySlug(String slug);

    List<Notebook> findAllByOrderBySortOrderAscCreatedAtAsc();

    List<Notebook> findByPrivateNotebookFalseOrderBySortOrderAscCreatedAtAsc();
}
