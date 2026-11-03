package top.mysgarden.garden.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import top.mysgarden.garden.model.Note;

public interface NoteRepository extends JpaRepository<Note, Integer>, JpaSpecificationExecutor<Note> {

    Optional<Note> findBySlug(String slug);

    Optional<Note> findBySourcePath(String sourcePath);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Integer id);

    long countByPublishedTrue();

    @Query("select coalesce(sum(n.views), 0) from Note n")
    long sumAllViews();

    @Query("select n.notebook.id, count(n.id) from Note n where n.published = true and n.notebook is not null group by n.notebook.id")
    List<Object[]> countPublishedByNotebook();

    @Query("select n.notebook.id, count(n.id) from Note n where n.published = true and n.encrypted = false and n.notebook is not null group by n.notebook.id")
    List<Object[]> countPublicByNotebook();

    @Query("select t.id, count(n.id) from Note n join n.tags t group by t.id")
    List<Object[]> countAllByTag();

    @Query("select t.id, count(n.id) from Note n join n.tags t where n.published = true and n.encrypted = false and (n.notebook is null or n.notebook.id not in :privateNotebookIds) group by t.id")
    List<Object[]> countPublicByTag(@Param("privateNotebookIds") Set<Integer> privateNotebookIds);

    @Query("select coalesce(sum(n.views), 0) from Note n where n.published = true and n.encrypted = false and (n.notebook is null or n.notebook.id not in :privateNotebookIds)")
    long sumPublicViews(@Param("privateNotebookIds") Set<Integer> privateNotebookIds);

    @Modifying
    @Query("update Note n set n.views = n.views + 1 where n.id = :id")
    int incrementViews(@Param("id") Integer id);

    List<Note> findTop5ByPublishedTrueOrderByCreatedAtDesc();

    List<Note> findByPublishedTrueOrderByCreatedAtDesc();
}
