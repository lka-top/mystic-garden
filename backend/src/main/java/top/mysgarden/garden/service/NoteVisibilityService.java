package top.mysgarden.garden.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.model.Notebook;
import top.mysgarden.garden.repository.NotebookRepository;

/** Public note policy shared by list, search, counts, and SEO queries. */
@Service
@RequiredArgsConstructor
public class NoteVisibilityService {

    private final NotebookRepository notebookRepository;

    public Specification<Note> publicNotes() {
        return publicNotes(privateNotebookIds());
    }

    Specification<Note> publicNotes(Set<Integer> privateNotebookIds) {
        return (root, query, cb) -> {
            Predicate visible = cb.and(
                    cb.isTrue(root.get("published")),
                    cb.isFalse(root.get("encrypted")));
            if (privateNotebookIds.isEmpty()) {
                return visible;
            }
            Join<Note, Notebook> notebook = root.join("notebook", JoinType.LEFT);
            return cb.and(visible, cb.or(
                    cb.isNull(notebook.get("id")),
                    cb.not(notebook.get("id").in(privateNotebookIds))));
        };
    }

    public boolean isPublic(Note note) {
        return note.isPublished()
                && !note.isEncrypted()
                && (note.getNotebook() == null || !privateNotebookIds().contains(note.getNotebook().getId()));
    }

    public Set<Integer> privateNotebookIds() {
        List<Notebook> notebooks = notebookRepository.findAll();
        Map<Integer, Notebook> byId = new HashMap<>();
        for (Notebook notebook : notebooks) {
            byId.put(notebook.getId(), notebook);
        }

        Set<Integer> privateIds = new HashSet<>();
        for (Notebook notebook : notebooks) {
            Integer currentId = notebook.getId();
            Set<Integer> visited = new HashSet<>();
            while (currentId != null && visited.add(currentId)) {
                Notebook current = byId.get(currentId);
                if (current == null) {
                    break;
                }
                if (current.isPrivateNotebook()) {
                    privateIds.add(notebook.getId());
                    break;
                }
                currentId = current.getParentId();
            }
        }
        return privateIds;
    }

    /** JPQL NOT IN needs a non-empty collection; notebook IDs are positive. */
    public Set<Integer> privateNotebookIdsWithSentinel() {
        Set<Integer> ids = privateNotebookIds();
        if (ids.isEmpty()) {
            return Set.of(-1);
        }
        return ids;
    }
}
