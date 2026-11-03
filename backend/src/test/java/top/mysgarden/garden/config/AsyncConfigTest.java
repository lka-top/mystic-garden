package top.mysgarden.garden.config;

import java.util.concurrent.CountDownLatch;

import org.junit.jupiter.api.Test;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import static org.assertj.core.api.Assertions.assertThatCode;

class AsyncConfigTest {

    @Test
    void saturatedViewCountQueueDoesNotRejectContentRequest() throws InterruptedException {
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) new AsyncConfig().viewCountExecutor();
        CountDownLatch releaseWorkers = new CountDownLatch(1);
        Runnable blockedTask = () -> {
            try {
                releaseWorkers.await();
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        };
        try {
            for (int i = 0; i < 104; i++) {
                executor.execute(blockedTask);
            }
            assertThatCode(() -> executor.execute(() -> {})).doesNotThrowAnyException();
        } finally {
            releaseWorkers.countDown();
            executor.shutdown();
        }
    }
}
