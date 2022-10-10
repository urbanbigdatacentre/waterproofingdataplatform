package org.waterproofingdata.wpdauth.model;

import java.sql.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.validation.constraints.Size;

import org.waterproofingdata.wpdauth.model.Roles;

import javax.persistence.ElementCollection;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Users {
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Integer id;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(unique = true, nullable = false)
	  private String username;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(unique = true, nullable = false)
	  private String nickname;

	  @Size(min = 8, message = "Minimum password length: 8 characters")
	  @Column(nullable = false)
	  private String password;

	  @Size(min = 10, max = 10, message = "Date of Born should be dd/MM/yyyy")
	  @Column(nullable = true)
	  private Date dateofborn;
	  
	  @Size(min = 1, max = 1, message = "Gender should be M (Male), F (Female), N (Not Informed)")
	  @Column(nullable = true)
	  private String gender;

	  @Size(min = 2, max = 2, message = "State should be 2 characteres (UF)")
	  @Column(nullable = false)
	  private String state;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(nullable = false)
	  private String city;

	  @Size(min = 1, max = 1, message = "Institution type should be E (School), D (Civil Defense), N (No governamental), O (others)")
	  @Column(nullable = true)
	  private String institutiontype;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(nullable = true)
	  private String institution;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(nullable = true)
	  private String securityquestion;

	  @Size(min = 4, max = 255, message = "Minimum name length: 4 characters")
	  @Column(nullable = true)
	  private String securityanswer;
	  
	  @Column(nullable = false)
	  private Boolean termsofusage;
	  
	  @Column(nullable = true)
	  private String avatar;

	  @Column(nullable = false)
	  private Integer active;
	  
	  @ElementCollection(fetch = FetchType.EAGER)
	  List<Roles> roles;
}
