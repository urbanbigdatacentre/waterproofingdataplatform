package org.waterproofingdata.wpdauth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.repository.UsersRepository;

@Service
public class MyUserDetails implements UserDetailsService {
	  @Autowired
	  private UsersRepository userRepository;

	  @Override
	  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    final Users user = userRepository.findByUsername(username);

	    if (user == null) {
	      throw new UsernameNotFoundException("User '" + username + "' not found");
	    }

	    return org.springframework.security.core.userdetails.User//
	        .withUsername(username)//
	        .password(user.getPassword())//
	        .authorities(user.getRoles())//
	        .accountExpired(false)//
	        .accountLocked(false)//
	        .credentialsExpired(false)//
	        .disabled(false)//
	        .build();
	  }
}
