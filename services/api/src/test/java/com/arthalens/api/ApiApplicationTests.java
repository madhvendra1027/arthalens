package com.arthalens.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;

@SpringBootTest(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=none"
})
class ApiApplicationTests {

    @MockBean
    private DataSource dataSource;

    @MockBean
    private Flyway flyway;

    @Test
    void contextLoads() {
    }

}

