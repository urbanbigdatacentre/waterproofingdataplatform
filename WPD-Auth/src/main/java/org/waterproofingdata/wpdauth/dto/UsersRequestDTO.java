package org.waterproofingdata.wpdauth.dto;

import java.sql.Date;
import java.util.List;

import org.waterproofingdata.wpdauth.model.Roles;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsersRequestDTO {
	  @ApiModelProperty(
			  position = 0,
			  name = "username",
			  dataType = "String",
			  value = "username of the user.",
			  example = "This is an unique field, and consumers should be aware of it. By convention, WP6 should send the user phone number (i.e. (99)99999-9999).",
			  required = true
			  )
	  private String username;

	  @ApiModelProperty(
			  position = 1,
			  name = "nickname",
			  dataType = "String",
			  value = "nickname of the user.",
			  example = "i.e. beth2021. This is an unique field, and consumers should be aware of it.",
			  required = true
			  )
	  private String nickname;
	  
	  @ApiModelProperty(
			  position = 2,
			  name = "password",
			  dataType = "String",
			  value = "password of the user.",
			  example = "i.e. P@s5w0rD.",
			  required = true
			  )
	  private String password;

	  @ApiModelProperty(
			  position = 3,
			  name = "dateofborn",
			  dataType = "String",
			  value = "Date of Born of the user.",
			  example = "i.e. 01/12/1978. Format should be dd/MM/yyyy.",
			  required = false
			  )
	  private Date dateofborn;
	  
	  @ApiModelProperty(
			  position = 4,
			  name = "gender",
			  dataType = "String",
			  value = "Gender of the user.",
			  example = "i.e. M. 'M' stands for Male, 'F' Female, 'N' Not Informed",
			  allowableValues = "{@code M, F, N}",
			  required = false
			  )
	  private String gender;

	  @ApiModelProperty(
			  position = 5,
			  name = "state",
			  dataType = "String",
			  value = "state of the user.",
			  example = "i.e. SP. State should be 2 characteres (UF)",
			  required = true
			  )
	  private String state;

	  @ApiModelProperty(
			  position = 6,
			  name = "city",
			  dataType = "String",
			  value = "city of the user.",
			  example = "i.e. 'Governador Valadares'.",
			  required = true
			  )
	  private String city;

	  @ApiModelProperty(
			  position = 7,
			  name = "institutiontype",
			  dataType = "String",
			  value = "institution type of the user.",
			  example = "i.e. 'E'. E stands for 'School', D 'Civil Defense', N 'No governamental', O 'others'",
			  allowableValues = "{@code E, D, N, O}",
			  required = false
			  )
	  private String institutiontype;

	  @ApiModelProperty(
			  position = 8,
			  name = "institution",
			  dataType = "String",
			  value = "institution of the user.",
			  example = "i.e. 'Colegio Imaginario'.",
			  required = false
			  )
	  private String institution;

	  @ApiModelProperty(
			  position = 9,
			  name = "securityquestion",
			  dataType = "String",
			  value = "security question of the user.",
			  example = "i.e. 'What is my favorite color?'.",
			  required = false
			  )
	  private String securityquestion;

	  @ApiModelProperty(
			  position = 10,
			  name = "securityanswer",
			  dataType = "String",
			  value = "security answer of the user.",
			  example = "i.e. 'Blue'.",
			  required = false
			  )
	  private String securityanswer;
	  
	  @ApiModelProperty(
			  position = 11,
			  name = "termsofusage",
			  dataType = "String",
			  value = "terms of usage of the user.",
			  example = "i.e. true.",
			  required = true
			  )
	  private boolean termsofusage;

	  @ApiModelProperty(
			  position = 12,
			  name = "roles",
			  dataType = "String",
			  value = "roles of the user.",
			  example = "i.e. [ROLE_CLIENT].",
			  required = true
			  )
	  private List<Roles> roles;
}
