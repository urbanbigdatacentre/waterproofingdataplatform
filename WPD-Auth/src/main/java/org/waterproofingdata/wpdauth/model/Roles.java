package org.waterproofingdata.wpdauth.model;

import org.springframework.security.core.GrantedAuthority;

public enum Roles implements GrantedAuthority {
	ROLE_ADMIN, ROLE_INSTITUTION, ROLE_CLIENT;

	public String getAuthority() {
		return name();
	 }
}
