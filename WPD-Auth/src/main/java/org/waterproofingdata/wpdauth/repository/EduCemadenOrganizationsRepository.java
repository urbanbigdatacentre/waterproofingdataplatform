package org.waterproofingdata.wpdauth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.waterproofingdata.wpdauth.model.EduCemadenOrganizations;

public interface EduCemadenOrganizationsRepository extends JpaRepository<EduCemadenOrganizations, Integer> {
	EduCemadenOrganizations findByActivationkey(UUID activationkey);
}
