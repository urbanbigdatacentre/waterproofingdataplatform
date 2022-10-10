package org.waterproofingdata.wpdauth.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity(name = "users_provider_activationkey")
@Getter
@Setter
@NoArgsConstructor
public class UsersProviderActivationKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name="users_id")
    private Integer usersid;

    @Column(nullable = false)
    private UUID activationkey;
}
