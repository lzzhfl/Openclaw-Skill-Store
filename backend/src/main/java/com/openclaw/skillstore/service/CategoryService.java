package com.openclaw.skillstore.service;

import com.openclaw.skillstore.model.vo.CategoryVO;
import java.util.List;

public interface CategoryService {
    List<CategoryVO> getAllCategories();
    List<CategoryVO> getCategoryTree();
}
