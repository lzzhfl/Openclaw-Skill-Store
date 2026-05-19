package com.openclaw.skillstore.service.impl;

import com.openclaw.skillstore.model.entity.Category;
import com.openclaw.skillstore.model.vo.CategoryVO;
import com.openclaw.skillstore.repository.CategoryRepository;
import com.openclaw.skillstore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryVO> getAllCategories() {
        return categoryRepository.findByParentIsNullOrderBySortOrder().stream()
            .map(this::toCategoryVO)
            .collect(Collectors.toList());
    }

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> roots = categoryRepository.findByParentIsNullOrderBySortOrder();
        return roots.stream()
            .map(this::buildTree)
            .collect(Collectors.toList());
    }

    private CategoryVO buildTree(Category category) {
        List<Category> children = categoryRepository.findByParentIdOrderBySortOrder(category.getId());
        List<CategoryVO> childVOs = children.stream()
            .map(this::buildTree)
            .collect(Collectors.toList());

        return CategoryVO.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .description(category.getDescription())
            .iconUrl(category.getIconUrl())
            .children(childVOs.isEmpty() ? null : childVOs)
            .build();
    }

    private CategoryVO toCategoryVO(Category c) {
        return CategoryVO.builder()
            .id(c.getId())
            .name(c.getName())
            .slug(c.getSlug())
            .description(c.getDescription())
            .iconUrl(c.getIconUrl())
            .build();
    }
}
