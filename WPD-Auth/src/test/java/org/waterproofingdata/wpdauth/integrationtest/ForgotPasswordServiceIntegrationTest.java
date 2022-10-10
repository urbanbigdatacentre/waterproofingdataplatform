package org.waterproofingdata.wpdauth.integrationtest;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsQuestions;
import org.waterproofingdata.wpdauth.service.ForgotPasswordsService;

@SpringBootTest
public class ForgotPasswordServiceIntegrationTest {
	@Autowired
	private ForgotPasswordsService forgotPasswordService;
	
	@Test
	public void testFindAllForgotPasswordQuestions() {
		List<ForgotPasswordsQuestions> r = forgotPasswordService.findAllForgotPasswordQuestions();
		assertTrue(r.size() > 0);
	}
	
}
