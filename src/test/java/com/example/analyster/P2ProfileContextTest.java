package com.example.analyster;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("p2")
class P2ProfileContextTest {

	@Test
	void contextLoadsWithH2Profile() {
		// smoke test
	}
}
