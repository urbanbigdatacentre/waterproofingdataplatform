package org.waterproofingdata.wpdauth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsQuestionsUsersAnswers;

public interface ForgotPasswordsQuestionsUsersAnswersRepository extends JpaRepository<ForgotPasswordsQuestionsUsersAnswers, Integer> {
	@Query(value = "SELECT 1 as id, fpq.id as forgotpassword_questions_id, us.id as users_id, us.securityanswer as answer FROM  auth.forgotpassword_questions fpq INNER JOIN auth.users us on fpq.question = us.securityquestion WHERE fpq.id = ?1 and us.id = ?2", nativeQuery = true)
	
	ForgotPasswordsQuestionsUsersAnswers findByForgotPasswordQuestionsAndUserid(Integer forgotpasswordquestionsid, Integer usersid);
}
