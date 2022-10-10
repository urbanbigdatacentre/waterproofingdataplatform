package org.waterproofingdata.wpdauth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.waterproofingdata.wpdauth.model.Users;

@Transactional
public interface UsersRepository extends JpaRepository<Users, Integer> {
	  Optional<Users> findById(Integer id);
      
	  boolean existsByUsername(String username);

	  Users findByUsername(String username);
	  
	  boolean existsByNickname(String nickname);
	  
	  @Query(value = "SELECT nickname || rank() OVER (PARTITION BY nickname) nickname_unique FROM auth.users WHERE nickname = ?1", nativeQuery = true)
	  String findSuggestedNickname(String nickname);
	  
	  @Modifying(clearAutomatically = true)
	  @Query(value = "UPDATE auth.users SET active = ?2 WHERE username = ?1", nativeQuery = true)
	  void activateByUsername(String username, Integer active);
}
