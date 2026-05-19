package com.openclaw.skillstore.controller;

import com.openclaw.skillstore.common.Result;
import com.openclaw.skillstore.model.vo.CategoryVO;
import com.openclaw.skillstore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public Result<List<CategoryVO>> getCategories() {
        return Result.success(categoryService.getCategoryTree());
    }
}
