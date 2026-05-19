package com.openclaw.skillstore.service;

import com.openclaw.skillstore.model.dto.LoginRequest;
import com.openclaw.skillstore.model.dto.RegisterRequest;
import java.util.Map;

public interface AuthService {
    Map<String, Object> register(RegisterRequest request);
    Map<String, Object> login(LoginRequest request);
    Map<String, Object> refreshToken(String refreshToken);
}
