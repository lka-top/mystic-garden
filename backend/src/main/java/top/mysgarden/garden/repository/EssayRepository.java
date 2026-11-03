package top.mysgarden.garden.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import top.mysgarden.garden.model.Essay;

public interface EssayRepository extends JpaRepository<Essay, Integer>, JpaSpecificationExecutor<Essay> {

    long countByPublishedTrue();

    List<Essay> findTop5ByPublishedTrueOrderByCreatedAtDesc();

    @Modifying
    @Query("update Essay e set e.likes = e.likes + 1 where e.id = :id")
    int incrementLikes(@Param("id") Integer id);
}
