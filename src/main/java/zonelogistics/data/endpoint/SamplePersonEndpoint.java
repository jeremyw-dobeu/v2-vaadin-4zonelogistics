package zonelogistics.data.endpoint;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import dev.hilla.exception.EndpointException;
import java.util.Optional;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import zonelogistics.data.entity.SamplePerson;
import zonelogistics.data.service.SamplePersonService;

@Endpoint
@AnonymousAllowed("ADMIN")
public class SamplePersonEndpoint {

    private final SamplePersonService service;

    public SamplePersonEndpoint(SamplePersonService service) {
        this.service = service;
    }

    @Nonnull
    public Page<@Nonnull SamplePerson> list(Pageable page) {
        return service.list(page);
    }

    public Optional<SamplePerson> get(@Nonnull Long id) {
        return service.get(id);
    }

    @Nonnull
    public SamplePerson update(@Nonnull SamplePerson entity) {
        try {
            return service.update(entity);
        } catch (OptimisticLockingFailureException e) {
            throw new EndpointException("Somebody else has updated the data while you were making changes.");
        }
    }

    public void delete(@Nonnull Long id) {
        service.delete(id);
    }

    public int count() {
        return service.count();
    }

}
