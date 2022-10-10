package org.waterproofingdata.wpdauth.service;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.waterproofingdata.wpdauth.exception.CustomException;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsKeys;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsQuestions;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsQuestionsUsersAnswers;
import org.waterproofingdata.wpdauth.model.Roles;
import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.repository.ForgotPasswordsKeysRepository;
import org.waterproofingdata.wpdauth.repository.ForgotPasswordsQuestionsRepository;
import org.waterproofingdata.wpdauth.repository.ForgotPasswordsQuestionsUsersAnswersRepository;
import org.waterproofingdata.wpdauth.repository.UsersRepository;
import org.waterproofingdata.wpdauth.security.JwtTokenProvider;

@Service
public class ForgotPasswordsService {
	@Autowired
	private ForgotPasswordsKeysRepository forgotPasswordsKeysRepository;
	
	@Autowired
	private ForgotPasswordsQuestionsRepository forgotPasswordsQuestionsRepository;
	
	@Autowired
	private ForgotPasswordsQuestionsUsersAnswersRepository forgotPasswordsQuestionsUsersAnswersRepository;
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
    @Autowired
    private JavaMailSender mailSender;	
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
	public void sendKeyByEmail(String email, String username) {
		Users user = usersRepository.findByUsername(username);
	    if (user == null) {
		      throw new CustomException("The username doesn't exist", HttpStatus.NOT_FOUND);
	    }		
		
		Random rand = new Random();
		String key = String.format("%04d", rand.nextInt(10000));
		//System.out.printf("%04d%n", rand.nextInt(10000));
		
		ForgotPasswordsKeys entity = new ForgotPasswordsKeys();
		entity.setUsername(username);
		entity.setKey(key);
		forgotPasswordsKeysRepository.save(entity);
		
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("noreply@wp6.com");
        message.setTo(email); 
        message.setSubject("Envio de código para alteração de senha"); 
        message.setText(String.format("Olá! Segue o código para alterar sua senha:'%s'. Informe esse código no aplicativo para prosseguir.", key));
        mailSender.send(message);		
	}
	
	public String loginByUsernameAndKey(String username, String key) {
		ForgotPasswordsKeys entity = forgotPasswordsKeysRepository.findTodayRecordByUsernameANDKey(username, key);
		if (entity == null) {
			throw new CustomException("The username and forgot key don't exist", HttpStatus.NOT_FOUND);
		}
		
		Users user = usersRepository.findByUsername(username);
	    if (user == null) {
		      throw new CustomException("The username doesn't exist", HttpStatus.NOT_FOUND);
	    }
	    
	    List<Roles> roles = user.getRoles();
		return jwtTokenProvider.createToken(username, roles);
	}
	
	public void passwordUpdateByUsername(String username, String newPassword) {
		Users user = usersRepository.findByUsername(username);
	    if (user == null) {
		      throw new CustomException("The username doesn't exist", HttpStatus.NOT_FOUND);
	    }
	    user.setPassword(passwordEncoder.encode(newPassword));
	    usersRepository.save(user);
	}
	
	public List<ForgotPasswordsQuestions> findAllForgotPasswordQuestions() {
		return forgotPasswordsQuestionsRepository.findAll();
	}
	
	public void saveForgotPasswordQuestionsUsersAnswers(ForgotPasswordsQuestionsUsersAnswers forgotPasswordQuestionsUsersAnswer) {
		if (!forgotPasswordsQuestionsRepository.existsById(forgotPasswordQuestionsUsersAnswer.getForgotpasswordquestionsid())) {
			throw new CustomException("The Forgot Password Questions provided doesn't exist", HttpStatus.NOT_FOUND);
		}
		
		if (!usersRepository.existsById(forgotPasswordQuestionsUsersAnswer.getUsersid())) {
			throw new CustomException("The User provided doesn't exist", HttpStatus.NOT_FOUND);
		}
		
		forgotPasswordsQuestionsUsersAnswersRepository.save(forgotPasswordQuestionsUsersAnswer);
	}
	
	public String loginByUsernameAndAnswers(String username, List<ForgotPasswordsQuestionsUsersAnswers> answers) {
		Users user = usersRepository.findByUsername(username);

	    if (user == null) {
	    	throw new CustomException("The username doesn't exist", HttpStatus.NOT_FOUND);
	    }
	    List<Roles> roles = user.getRoles();


		boolean correctAnswers = false;
		
	    for (ForgotPasswordsQuestionsUsersAnswers answer : answers) {
	    	ForgotPasswordsQuestionsUsersAnswers answerComparison = forgotPasswordsQuestionsUsersAnswersRepository.findByForgotPasswordQuestionsAndUserid(answer.getForgotpasswordquestionsid(), user.getId());
						
			if (answerComparison == null) {
	    		throw new CustomException("The comparison answer doesn't exist", HttpStatus.NOT_FOUND);
			}
			
	    	if (answer.getAnswer().equalsIgnoreCase(answerComparison.getAnswer())) {
				correctAnswers = true;
				break;
	    	}
		}
		
	    if (!correctAnswers) {
	    	throw new CustomException("Invalid answers supplied to login. Must have at least 2 correct ones.", HttpStatus.UNPROCESSABLE_ENTITY);
	    }
		
		return jwtTokenProvider.createToken(username, roles);
	}
}
