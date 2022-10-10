package org.waterproofingdata.wpdauth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsQuestions;

public interface ForgotPasswordsQuestionsRepository extends JpaRepository<ForgotPasswordsQuestions, Integer> {
}
