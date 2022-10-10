package org.waterproofingdata.wpdauth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.waterproofingdata.wpdauth.model.Roles;
import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.model.UsersEducemadenOrganizations;
import org.waterproofingdata.wpdauth.repository.UsersRepository;
import org.waterproofingdata.wpdauth.service.UsersService;

@SpringBootApplication
public class WpdauthApplication implements CommandLineRunner {
	@Autowired
	private UsersRepository usersRepository;	
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(WpdauthApplication.class, args);
	}
	
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Override
	public void run(String... params) throws Exception {
		if (!usersRepository.existsByUsername("admin")) {
			Users admin = new Users();
		    admin.setUsername("admin");
		    admin.setNickname("admin");
		    admin.setPassword(passwordEncoder.encode("admin"));
		    admin.setState("SP");
		    admin.setCity("São Paulo");
		    admin.setTermsofusage(true);
		    admin.setActive(1);
		    admin.setRoles(new ArrayList<Roles>(Arrays.asList(Roles.ROLE_ADMIN)));
		
		    usersRepository.save(admin);
		}
	}

}
