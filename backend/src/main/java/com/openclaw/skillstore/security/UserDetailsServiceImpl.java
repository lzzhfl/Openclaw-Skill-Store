package com.openclaw.skillstore.security;

import com.openclaw.skillstore.model.entity.User;
import com.openclaw.skillstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username format: "userId:username"
        String actualUsername = username.contains(":") ? username.split(":")[1] : username;
        User user = userRepository.findByUsername(actualUsername)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + actualUsername));

        return new org.springframework.security.core.userdetails.User(
            user.getId() + ":" + user.getUsername(),
            user.getPasswordHash(),
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
