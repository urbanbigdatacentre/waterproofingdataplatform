package org.waterproofingdata.wpdauth.integrationtest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID; 

import com.google.gson.Gson;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.waterproofingdata.wpdauth.dto.UsersRequestDTO;
import org.waterproofingdata.wpdauth.exception.CustomException;
import org.waterproofingdata.wpdauth.model.EduCemadenOrganizations;
import org.waterproofingdata.wpdauth.model.Roles;
import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.model.UsersEducemadenOrganizations;
import org.waterproofingdata.wpdauth.model.UsersProviderActivationKey;
import org.waterproofingdata.wpdauth.repository.EduCemadenOrganizationsRepository;
import org.waterproofingdata.wpdauth.repository.UsersEducemadenOrganizationsRepository;
import org.waterproofingdata.wpdauth.repository.UsersProviderActivationKeyRepository;
import org.waterproofingdata.wpdauth.service.UsersService;

@SpringBootTest
public class UsersServiceIntegrationTest {
	@Autowired
	private UsersService usersService;
	
	@Autowired
	private EduCemadenOrganizationsRepository eduCemadenOrganizationsRepository;
	
	@Autowired
	private UsersEducemadenOrganizationsRepository usersEducemadenOrganizationsRepository;
	
	@Autowired
	private UsersProviderActivationKeyRepository usersProviderActivationKeyRepository;
	
	private Users setUpUserTest(String userNamePrefix, Roles role) {
		Users u = new Users();
		String uName = String.format("%s%s", userNamePrefix, UUID.randomUUID().toString());
		u.setUsername(uName);
		u.setNickname(uName);		
		u.setPassword(UUID.randomUUID().toString());
		u.setState("SP");
		u.setCity("São Paulo");
		u.setTermsofusage(true);
		u.setRoles(new ArrayList<Roles>(Arrays.asList(role)));
		String uJson = new Gson().toJson(u);
		
		UsersRequestDTO urDTO = new UsersRequestDTO();
		urDTO.setUsername(uName);
		urDTO.setNickname(uName);		
		urDTO.setPassword(UUID.randomUUID().toString());
		urDTO.setState("SP");
		urDTO.setCity("São Paulo");
		urDTO.setTermsofusage(true);
		urDTO.setRoles(new ArrayList<Roles>(Arrays.asList(role)));
		String urDTOJson = new Gson().toJson(u);
		
		return u;
	}
	
	@Test
	public void testInvalidLogin() {
		CustomException thrown = assertThrows(
				CustomException.class,
			() -> usersService.login("xpto", "xpto"),
			"Expected usersService.login(xpto, xpto) to throw, but it didn't"
		);
		
		assertTrue(thrown.getMessage().contains("The user doesn't exist"));
		assertEquals(HttpStatus.NOT_FOUND, thrown.getHttpStatus());
	}
	
	@Test
	public void testAdmUserLogin() {
		String login = usersService.login("admin", "admin");
		assertNotNull(login, "Login token returned from usersService.login() should not be null");
	}
	
	@Test 
	public void testAdmUserSearch() {
		Users u = usersService.search("admin");
		assertEquals("admin", u.getUsername());
		assertEquals("admin", u.getNickname());
		assertEquals("SP", u.getState());
		assertEquals("São Paulo", u.getCity());
		assertEquals(true, u.getTermsofusage());
		assertEquals(1, u.getActive());
		assertEquals(Roles.ROLE_ADMIN, u.getRoles().get(0));		
	}
	
	@Test 
	public void testAdmUserFindById() {
		Users u = usersService.findById(1);
		assertEquals("admin", u.getUsername());
		assertEquals("admin", u.getNickname());
		assertEquals("SP", u.getState());
		assertEquals("São Paulo", u.getCity());
		assertEquals(true, u.getTermsofusage());
		assertEquals(1, u.getActive());
		assertEquals(Roles.ROLE_ADMIN, u.getRoles().get(0));		
	}	
	
	@Test 
	public void testRandomUserSignup() {
		Users u = setUpUserTest("user_", Roles.ROLE_CLIENT);
		String signup = usersService.signup(u);
		assertNotNull(signup, "Signup token returned from usersService.signup(user) should not be null");
		assertEquals(true, usersService.existsByUsername(u.getUsername()));
		assertEquals(true, usersService.existsByNickname(u.getNickname()));
	}
	
	// @Test 
	// public void testRandomUserInstitutionAndClientRegistration() {
	// 	List<EduCemadenOrganizations> leco = eduCemadenOrganizationsRepository.findAll();
	// 	assertTrue(leco.size() > 0, "List<EduCemadenOrganizations> should return rows.");
	// 	UUID u_s = leco.get(0).getActivationkey(); 
	// 	EduCemadenOrganizations eco = eduCemadenOrganizationsRepository.findByActivationkey(u_s);
	// 	assertNotNull(eco, "EduCemadenOrganizations should be returned.");
		
	// 	Users userInst = setUpUserTest("user_institution_", Roles.ROLE_INSTITUTION);
	// 	String signup = usersService.signup(userInst);
	// 	assertNotNull(signup, "Signup token returned from usersService.signup(userInst) should not be null");
	// 	usersService.activate(userInst.getUsername(), eco.getActivationkey().toString());
	// 	Users userInstUpdated = usersService.search(userInst.getUsername());

	// 	UsersProviderActivationKey userInstUpdatedProviderKey = usersProviderActivationKeyRepository.findByUsersid(userInstUpdated.getId());
	// 	String keyFromUserInstToUserClient = userInstUpdatedProviderKey.getActivationkey().toString();
	// 	Users userClient = setUpUserTest("user_client_institution_",  Roles.ROLE_CLIENT);
	// 	String signup2 = usersService.signup(userClient);
	// 	assertNotNull(signup2, "Signup token returned from usersService.signup(userClient) should not be null");
	// 	usersService.activate(userClient.getUsername(), keyFromUserInstToUserClient);
	// }	
}
