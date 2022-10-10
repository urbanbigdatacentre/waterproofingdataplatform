package org.waterproofingdata.wpdauth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.waterproofingdata.wpdauth.model.UsersEducemadenOrganizations;

public interface UsersEducemadenOrganizationsRepository extends JpaRepository<UsersEducemadenOrganizations, Integer> {
	
	UsersEducemadenOrganizations findByUsersid(Integer usersid);
	
	UsersEducemadenOrganizations findByActivationkey(UUID activationkey);
}
