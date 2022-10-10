package org.waterproofingdata.wpdauth.dto;

import io.swagger.annotations.ApiModelProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordsQuestionsUsersAnswersRequestDTO {
    @ApiModelProperty(position = 0)
    private Integer id;

    @ApiModelProperty(position = 1)
    private Integer forgotpasswordquestionsid;

    @ApiModelProperty(position = 2)    
    private Integer usersid;

    @ApiModelProperty(position = 3)
    private String answer;
}
