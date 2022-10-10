package org.waterproofingdata.wpdauth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.waterproofingdata.wpdauth.model.UsersProviderActivationKey;

public interface UsersProviderActivationKeyRepository extends JpaRepository<UsersProviderActivationKey, Integer> {
	UsersProviderActivationKey findByActivationkey(UUID activationkey);
	
	UsersProviderActivationKey findByUsersid(Integer usersid);
}
