package org.waterproofingdata.wpdauth.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "forgotpassword_questions_users_answers")
@Getter
@Setter
@NoArgsConstructor
public class ForgotPasswordsQuestionsUsersAnswers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name="forgotpassword_questions_id")
    private Integer forgotpasswordquestionsid;
    
    @Column(nullable = false, name="users_id")
    private Integer usersid;

    @Column(nullable = false)
    private String answer;

}
