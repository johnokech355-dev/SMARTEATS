package com.rms.backend2.repository;

import com.rms.backend2.model.MenuIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuIngredientRepository extends JpaRepository<MenuIngredient, Long> {

    List<MenuIngredient> findByMenuItemId(Long menuItemId);

}