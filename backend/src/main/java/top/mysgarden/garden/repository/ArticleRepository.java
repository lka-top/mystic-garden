package top.mysgarden.garden.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import top.mysgarden.garden.model.Article;

public interface ArticleRepository extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {

    Optional<Article> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Integer id);

    long countByPublishedTrue();

    @Query("select coalesce(sum(a.views), 0) from Article a")
    long sumAllViews();

    @Query("select a.category.id, count(a.id) from Article a where a.published = true and a.category is not null group by a.category.id")
    List<Object[]> countPublishedByCategory();

    @Query("select t.id, count(a.id) from Article a join a.tags t where a.published = true group by t.id")
    List<Object[]> countPublishedByTag();

    @Query("select t.id, count(a.id) from Article a join a.tags t group by t.id")
    List<Object[]> countAllByTag();

    @Modifying
    @Query("update Article a set a.views = a.views + 1 where a.id = :id")
    int incrementViews(@Param("id") Integer id);

    List<Article> findTop5ByPublishedTrueOrderByCreatedAtDesc();

    List<Article> findTop20ByPublishedTrueOrderByCreatedAtDesc();

    List<Article> findByPublishedTrueOrderByCreatedAtDesc();
}
