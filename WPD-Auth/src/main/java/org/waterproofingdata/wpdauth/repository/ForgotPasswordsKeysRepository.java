package org.waterproofingdata.wpdauth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.waterproofingdata.wpdauth.model.ForgotPasswordsKeys;

public interface ForgotPasswordsKeysRepository extends JpaRepository<ForgotPasswordsKeys, Integer> {
	@Query(value = "SELECT f.* FROM auth.forgotpassword_keys f WHERE f.username = ?1 AND f.key = ?2 AND f.created_at >= current_date::timestamp AND f.created_at < current_date::timestamp + interval '1 day' ORDER BY f.id DESC LIMIT 1", nativeQuery = true)
	ForgotPasswordsKeys findTodayRecordByUsernameANDKey(String username, String key);
}
