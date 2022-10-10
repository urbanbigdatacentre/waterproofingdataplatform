package org.waterproofingdata.wpdauth.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.waterproofingdata.wpdauth.exception.CustomException;
import org.waterproofingdata.wpdauth.model.EduCemadenOrganizations;
import org.waterproofingdata.wpdauth.model.Roles;
import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.model.UsersEducemadenOrganizations;
import org.waterproofingdata.wpdauth.model.UsersProviderActivationKey;
import org.waterproofingdata.wpdauth.repository.EduCemadenOrganizationsRepository;
import org.waterproofingdata.wpdauth.repository.UsersEducemadenOrganizationsRepository;
import org.waterproofingdata.wpdauth.repository.UsersProviderActivationKeyRepository;
import org.waterproofingdata.wpdauth.repository.UsersRepository;
import org.waterproofingdata.wpdauth.security.JwtTokenProvider;

@Service
public class UsersService {
	  @Autowired
	  private UsersRepository usersRepository;
	  
	  @Autowired
	  private EduCemadenOrganizationsRepository eduCemadenOrganizationsRepository;
	  
	  @Autowired
	  private UsersEducemadenOrganizationsRepository usersEducemadenOrganizationsRepository;
	  
	  @Autowired
	  private UsersProviderActivationKeyRepository usersProviderActivationKeyRepository;

	  @Autowired
	  private PasswordEncoder passwordEncoder;

	  @Autowired
	  private JwtTokenProvider jwtTokenProvider;

	  @Autowired
	  private AuthenticationManager authenticationManager;
	  
	  private void addNewUsersEducemadenOrganization(Integer userid, Integer educemadenorganizationsid, UUID uuid_activationkey, Roles role) {
		  UsersEducemadenOrganizations userEducemadenOrg = new UsersEducemadenOrganizations();
		  userEducemadenOrg.setUsersid(userid);
		  userEducemadenOrg.setEducemadenorganizationsid(educemadenorganizationsid);
		  userEducemadenOrg.setActivationkey(uuid_activationkey);
		  usersEducemadenOrganizationsRepository.save(userEducemadenOrg);
		  
		  if (role == Roles.ROLE_INSTITUTION) {
			  UUID new_uuid = UUID.randomUUID();
			  UsersProviderActivationKey userRolesProviderActivationKey = new UsersProviderActivationKey();
			  userRolesProviderActivationKey.setUsersid(userid);
			  userRolesProviderActivationKey.setActivationkey(new_uuid);
			  usersProviderActivationKeyRepository.save(userRolesProviderActivationKey);
		  }
	  }
	  
	  public Users findById(Integer id) {
		  return usersRepository.findById(id).orElseThrow(() -> new CustomException("The user doesn't exist", HttpStatus.NOT_FOUND));
	  }
	  
	  public boolean existsByUsername(String username) {
		  return usersRepository.existsByUsername(username);
	  }
	  
	  public boolean existsByNickname(String nickname) {
		  return usersRepository.existsByNickname(nickname);
	  }
	  
	  public Users search(String username) {
		  Users user = usersRepository.findByUsername(username);
		  if (user == null) {
			  throw new CustomException("The user doesn't exist", HttpStatus.NOT_FOUND);
		  }
		  return user;
	  }

	  public String login(String username, String password) {
	    try {
	    	Users u = search(username);
	    	authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
	    	return jwtTokenProvider.createToken(username, u.getRoles());
	    } 
	    catch (CustomException ce) {
	    	throw ce;
	    }
	    catch (AuthenticationException ae) {
	    	throw new CustomException("Invalid username/password supplied", HttpStatus.NOT_FOUND);
	    }
	    catch (Exception e) {
	    	throw new CustomException("Something went wrong", HttpStatus.BAD_REQUEST);
	    }
	  }

	  public String signup(Users user) {
		  if (user.getUsername().length() == 0) {
			  throw new CustomException("Username must be provided", HttpStatus.UNPROCESSABLE_ENTITY);
		  }
			  
		  if (!existsByUsername(user.getUsername())) {
			  if (user.getNickname().length() == 0) {
				  throw new CustomException("Nickname must be provided", HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  else if (existsByNickname(user.getNickname())) {
				  String nickname_unique = usersRepository.findSuggestedNickname(user.getNickname());
				  throw new CustomException(String.format("Nickname already exists. Would you like to use '%s'?", nickname_unique), HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  if (user.getPassword().length() == 0) {
				  throw new CustomException("Password must be provided", HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  if (user.getState().length() == 0) {
				  throw new CustomException("State must be provided", HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  if (user.getCity().length() == 0) {
				  throw new CustomException("City must be provided", HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  if (user.getTermsofusage() != true) {
				  throw new CustomException("Terms of usage must be accepted", HttpStatus.UNPROCESSABLE_ENTITY);
			  }
			  if (user.getRoles().size() != 1) {
				  throw new CustomException("Only one user.role must be provided", HttpStatus.UNPROCESSABLE_ENTITY);				  
			  }

			  user.setPassword(passwordEncoder.encode(user.getPassword()));
			  user.setActive(0);
			  try {
				  usersRepository.save(user);
				  return jwtTokenProvider.createToken(user.getUsername(), user.getRoles());
			  }
			  catch (Exception e) {
				  throw new CustomException("Something went wrong", HttpStatus.BAD_REQUEST);
			  }
		  } 
		  else {
			  throw new CustomException("Username is already in use", HttpStatus.UNPROCESSABLE_ENTITY);
		  }
	  }
	  
	  public void activate(String username, String activationkey) {
		  Users user = search(username);
		  if (user.getActive() != 0) {
			  throw new CustomException("User should be inactive to be activated", HttpStatus.UNPROCESSABLE_ENTITY);
		  }
		  if (user.getRoles().size() != 1) {
			  throw new CustomException("User must have only one user.role", HttpStatus.UNPROCESSABLE_ENTITY);				  
		  }
		  
		  UUID uuid_activationkey = UUID.fromString(activationkey);
		  if (user.getRoles().get(0) == Roles.ROLE_INSTITUTION) {
			  EduCemadenOrganizations eco = eduCemadenOrganizationsRepository.findByActivationkey(uuid_activationkey);
			  if (eco == null) {
				  throw new CustomException("EduCemadenOrganization Activationkey not found.", HttpStatus.NOT_FOUND);				  
			  }
			  usersRepository.activateByUsername(username, 1);
			  addNewUsersEducemadenOrganization(user.getId(), eco.getId(), uuid_activationkey,  Roles.ROLE_INSTITUTION);
		  }
		  else if (user.getRoles().get(0) == Roles.ROLE_CLIENT) {
			  UsersProviderActivationKey userAdmProviderActivationKey = usersProviderActivationKeyRepository.findByActivationkey(uuid_activationkey);
			  if (userAdmProviderActivationKey == null) {
				  throw new CustomException(String.format("userAdmProvider.ActivationKey '%s' not found.", activationkey), HttpStatus.NOT_FOUND);
			  }
			  UsersEducemadenOrganizations userAdmEducemadenOrganization = usersEducemadenOrganizationsRepository.findByUsersid(userAdmProviderActivationKey.getUsersid());
			  if (userAdmEducemadenOrganization == null) {
				  throw new CustomException("ROLE_INSTITUTION EduCemadenOrganization not found.", HttpStatus.NOT_FOUND);
			  }
			  usersRepository.activateByUsername(username, 1);
			  addNewUsersEducemadenOrganization(user.getId(), userAdmEducemadenOrganization.getEducemadenorganizationsid(), uuid_activationkey,  Roles.ROLE_CLIENT);			  
		  }
		  else if (user.getRoles().get(0) == Roles.ROLE_ADMIN) {
			  throw new CustomException("Admin users should be activated through database.", HttpStatus.UNPROCESSABLE_ENTITY);
		  }
		  else {
			  throw new CustomException("There is a problem with this User registration and it can not be activated.", HttpStatus.BAD_REQUEST); 
		  }
	  }

	  public Users whoami(HttpServletRequest req) {
		  return usersRepository.findByUsername(jwtTokenProvider.getUsername(jwtTokenProvider.resolveToken(req)));
	  }
	  
	  public EduCemadenOrganizations findEduCemadenOrganizationById(Integer userid) {
		  UsersEducemadenOrganizations userAdmEducemadenOrganization = usersEducemadenOrganizationsRepository.findByUsersid(userid);
		  if (userAdmEducemadenOrganization == null) {
			  return null;
		  }
		  eduCemadenOrganizationsRepository.findAll();
		  return eduCemadenOrganizationsRepository.getById(userAdmEducemadenOrganization.getEducemadenorganizationsid());
	  }
	  
	  public UsersProviderActivationKey findProviderActivationKeyById(Integer usersid) {
		  return usersProviderActivationKeyRepository.findByUsersid(usersid); 
	  }

	  public String refresh(String username) {
	    return jwtTokenProvider.createToken(username, usersRepository.findByUsername(username).getRoles());
	  }
}
