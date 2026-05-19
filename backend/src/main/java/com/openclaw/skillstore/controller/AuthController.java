package com.openclaw.skillstore.controller;

import com.openclaw.skillstore.common.Result;
import com.openclaw.skillstore.model.dto.LoginRequest;
import com.openclaw.skillstore.model.dto.RegisterRequest;
import com.openclaw.skillstore.model.vo.UserVO;
import com.openclaw.skillstore.repository.UserRepository;
import com.openclaw.skillstore.model.entity.User;
import com.openclaw.skillstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        return Result.success(authService.register(request));
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }

    @PostMapping("/refresh")
    public Result<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
        return Result.success(authService.refreshToken(body.get("refreshToken")));
    }

    @GetMapping("/me")
    public Result<UserVO> me(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        User user = userRepository.findById(userId).orElseThrow();
        return Result.success(UserVO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .avatarUrl(user.getAvatarUrl())
            .bio(user.getBio())
            .role(user.getRole().name())
            .createdAt(user.getCreatedAt())
            .build());
    }
}
