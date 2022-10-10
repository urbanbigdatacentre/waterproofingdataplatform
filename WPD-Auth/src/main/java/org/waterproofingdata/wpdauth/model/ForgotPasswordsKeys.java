package org.waterproofingdata.wpdauth.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "forgotpassword_keys")
@Getter
@Setter
@NoArgsConstructor
public class ForgotPasswordsKeys {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String key;

    @Column(nullable = false)
    private String created_at;
}
