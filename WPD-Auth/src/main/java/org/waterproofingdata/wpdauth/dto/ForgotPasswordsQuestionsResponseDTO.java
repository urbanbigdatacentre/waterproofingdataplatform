package org.waterproofingdata.wpdauth.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordsQuestionsResponseDTO {
	@ApiModelProperty(position = 0)
    private Integer id;

	@ApiModelProperty(position = 1)
    private String question;

	@ApiModelProperty(position = 2)
    private Integer active;
}
