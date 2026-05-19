package com.openclaw.skillstore.service.impl;

import com.openclaw.skillstore.common.UserRole;
import com.openclaw.skillstore.exception.BusinessException;
import com.openclaw.skillstore.model.dto.LoginRequest;
import com.openclaw.skillstore.model.dto.RegisterRequest;
import com.openclaw.skillstore.model.entity.User;
import com.openclaw.skillstore.repository.UserRepository;
import com.openclaw.skillstore.security.JwtTokenProvider;
import com.openclaw.skillstore.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .build();

        userRepository.save(user);
        log.info("User registered: {}", user.getUsername());

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("username", user.getUsername());
        return result;
    }

    @Override
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid username or password");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        log.debug("User logged in: {}", user.getUsername());

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("username", user.getUsername());
        result.put("role", user.getRole().name());
        return result;
    }

    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new BusinessException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", newAccessToken);
        return result;
    }
}
