package top.mysgarden.garden.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import top.mysgarden.garden.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer>, JpaSpecificationExecutor<Comment> {

    long countByApprovedTrue();

    long countByArticleIdAndApprovedTrue(Integer articleId);

    @Query("select c.articleId, count(c.id) from Comment c where c.approved = true and c.articleId in :articleIds group by c.articleId")
    List<Object[]> countApprovedByArticleIds(@Param("articleIds") Collection<Integer> articleIds);

    @Query("select c.essayId, count(c.id) from Comment c where c.approved = true and c.essayId in :essayIds group by c.essayId")
    List<Object[]> countApprovedByEssayIds(@Param("essayIds") Collection<Integer> essayIds);

    List<Comment> findByParentIdInOrderByCreatedAtAsc(Collection<Integer> parentIds);

    List<Comment> findByParentIdInAndApprovedTrueOrderByCreatedAtAsc(Collection<Integer> parentIds);
}
