package org.waterproofingdata.wpdauth.controller;

import javax.servlet.http.HttpServletRequest;

import org.waterproofingdata.wpdauth.dto.CustomMapper;
import org.waterproofingdata.wpdauth.dto.UsersRequestDTO;
import org.waterproofingdata.wpdauth.dto.UsersResponseDTO;
import org.waterproofingdata.wpdauth.model.Users;
import org.waterproofingdata.wpdauth.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;

@RestController
@RequestMapping("/users")
@Api(tags = "users")
public class UsersController {
	  @Autowired
	  private UsersService userService;
	  
	  @GetMapping(value = "/{id}")
	  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_INSTITUTION') or hasRole('ROLE_CLIENT')")
	  @ApiOperation(
	      value = "${UserController.findById}", 
	      response = UsersResponseDTO.class, 
	      authorizations = { @Authorization(value="apiKey") },
	      notes = "This is the user findById search method."
	  )
	  @ApiResponses(value = {//
	          @ApiResponse(code = 403, message = "Access denied"), //
	          @ApiResponse(code = 404, message = "The user doesn't exist"), //
	          @ApiResponse(code = 500, message = "Expired or invalid JWT token")
	      }
	  )
	  public UsersResponseDTO findById (
	          @ApiParam(
	                  name = "id",
	                  type = "Integer",
	                  value = "user id",
	                  example = "A positive numeric id.",
	                  required = true
	              ) 
	          @RequestParam Integer id		  
	      ) {
	      UsersResponseDTO urDTO = CustomMapper.map(userService.findById(id), UsersResponseDTO.class);
	      urDTO.setEduCemadenOrganization(userService.findEduCemadenOrganizationById(urDTO.getId()));
	      urDTO.setProviderActivationKey(userService.findProviderActivationKeyById(urDTO.getId()));
	      return urDTO;
	  }	  

	  @PostMapping("/existsByUsername")
	  @ApiOperation(
		  value = "${UserController.existsByUsername}",
		  notes = "From a username, this method returns if there is a username in db or not."
	  )
	  @ApiResponses(value = {//
		      @ApiResponse(code = 400, message = "Something went wrong")
	      }
	  )
	  public boolean existsByUsername(//
		      @ApiParam(
	    		  name = "username",
	    		  type = "String",
	    		  value = "username of the user",
	    		  example = "This is an unique field, and consumers should be aware of it. By convention, WP6 should send the user phone number (i.e. (99)99999-9999).",
	    		  required = true
		      ) 
		      @RequestParam String username
		  ) {
		  return userService.existsByUsername(username);
	  }	 
	  
	  @PostMapping("/existsByNickname")
	  @ApiOperation(
		  value = "${UserController.existsByNickname}",
		  notes = "From a nickname, this method returns if there is a nickname in db or not."
	  )
	  @ApiResponses(value = {//
		      @ApiResponse(code = 400, message = "Something went wrong")
	      }
	  )
	  public boolean existsByNickname(//
		      @ApiParam(
	    		  name = "nickname",
	    		  type = "String",
	    		  value = "nickname of the user",
	    		  example = "This is an unique field, and consumers should be aware of it.",
	    		  required = true
		      ) 
		      @RequestParam String nickname
		  ) {
		  return userService.existsByNickname(nickname);
	  }
	  
	  @PostMapping("/login")
	  @ApiOperation(
		  value = "${UserController.login}",
		  notes = "From a valid username and password, this method returns the JWT Token to be used in secure methods."
	  )
	  @ApiResponses(value = {//
		      @ApiResponse(code = 400, message = "Something went wrong"), //
		      @ApiResponse(code = 404, message = "Invalid username/password supplied")
	      }
	  )
	  public String login(//
		      @ApiParam(
	    		  name = "username",
	    		  type = "String",
	    		  value = "username of the user",
	    		  example = "This is an unique field, and consumers should be aware of it. By convention, WP6 should send the user phone number (i.e. (99)99999-9999).",
	    		  required = true
		      ) 
		      @RequestParam String username, //
		      @ApiParam(
				  name = "password",
				  type = "String",
				  value = "password of the user",
				  example = "i.e. P@s5w0rD",
				  required = true	    		  
			  ) 
		      @RequestParam String password
		  ) {
		  return userService.login(username, password);
	  }

	  @PostMapping("/signup")
	  @ApiOperation(
		  value = "${UserController.signup}",
		  notes = "This the signup method to create new users. By defaul all users are created as inactive. To activate, the method ${UserController.activate} should be invoked."
	  )
	  @ApiResponses(value = {//
		      @ApiResponse(code = 400, message = "Something went wrong"), //
		      @ApiResponse(code = 422, message = "Required parameters should be provided")
	      }
	  )
	  public String signup(
			  @ApiParam(
				  name = "user",
				  value = "Signup User", 
				  required = true
			  )
			  @RequestBody UsersRequestDTO user
		  ) {
		  return userService.signup(CustomMapper.map(user, Users.class));
	  }
	  
	  @PostMapping("/activate")
	  @PreAuthorize("hasRole('ROLE_INSTITUTION') or hasRole('ROLE_CLIENT')")
	  @ApiOperation(
		  value = "${UserController.activate}", 
		  authorizations = { @Authorization(value="apiKey") },
		  notes = "This is the user activation method."
	  )
	  @ApiResponses(value = {//
	      @ApiResponse(code = 400, message = "Something went wrong"), //
	      @ApiResponse(code = 403, message = "Access denied"), //
	      @ApiResponse(code = 422, message = "User or ActivationKey registration issues"), //
	      @ApiResponse(code = 500, message = "Expired or invalid JWT token")
	  	}
	  )
	  public String activate(
			  @ApiParam(
				  name = "username",
				  type = "String",
				  value = "username of the user",
				  example = "This is an unique field, and consumers should be aware of it. By convention, WP6 should send the user phone number (i.e. (99)99999-9999).",
				  required = true
			  ) 
			  @RequestParam String username, // 
			  @ApiParam(
				  name = "activationkey",
				  type = "String",
				  value = "Activation Key to activate the user",
				  example = "If user belongs to 'ROLE_INSTITUTION' the key should be collected from the EduCemadenOrganization registration. If the user belongs to 'ROLE_CLIENT' the key should be provided by a 'ROLE_INSTITUTION' valid user.",
				  required = true					  
			  ) 
			  @RequestParam String activationkey
		  ) {
		  userService.activate(username, activationkey);
		  return username;
	  }

	  @GetMapping(value = "/{username}")
	  @PreAuthorize("hasRole('ROLE_ADMIN')")
	  @ApiOperation(
		  value = "${UserController.search}", 
		  response = UsersResponseDTO.class, 
		  authorizations = { @Authorization(value="apiKey") },
		  notes = "This is the user search method by username."
	  )
	  @ApiResponses(value = {//
		      @ApiResponse(code = 403, message = "Access denied"), //
		      @ApiResponse(code = 404, message = "The user doesn't exist"), //
		      @ApiResponse(code = 500, message = "Expired or invalid JWT token")
	      }
	  )
	  public UsersResponseDTO search(
			  @ApiParam(
					  name = "username",
					  type = "String",
					  value = "username of the user",
					  example = "This is an unique field, and consumers should be aware of it. By convention, WP6 should send the user phone number (i.e. (99)99999-9999).",
					  required = true
				  ) 
			  @RequestParam String username		  
		  ) {
		  UsersResponseDTO urDTO = CustomMapper.map(userService.search(username), UsersResponseDTO.class);
		  urDTO.setEduCemadenOrganization(userService.findEduCemadenOrganizationById(urDTO.getId()));
		  urDTO.setProviderActivationKey(userService.findProviderActivationKeyById(urDTO.getId()));
		  return urDTO;
	  }

	  @GetMapping(value = "/me")
	  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_INSTITUTION') or hasRole('ROLE_CLIENT')")
	  @ApiOperation(
		  value = "${UserController.me}", 
		  response = UsersResponseDTO.class, 
		  authorizations = { @Authorization(value="apiKey") },
		  notes = "This is the user search method by token."
	  )
	  @ApiResponses(value = {//
	      @ApiResponse(code = 400, message = "Something went wrong"), //
	      @ApiResponse(code = 403, message = "Access denied"), //
	      @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
	  public UsersResponseDTO whoami(HttpServletRequest req) {
		  UsersResponseDTO urDTO = CustomMapper.map(userService.whoami(req), UsersResponseDTO.class);
		  urDTO.setEduCemadenOrganization(userService.findEduCemadenOrganizationById(urDTO.getId()));
		  urDTO.setProviderActivationKey(userService.findProviderActivationKeyById(urDTO.getId()));
		  return urDTO;
	  }

	  @GetMapping("/refresh")
	  @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_INSTITUTION') or hasRole('ROLE_CLIENT')")
	  public String refresh(HttpServletRequest req) {
	    return userService.refresh(req.getRemoteUser());
	  }
}
