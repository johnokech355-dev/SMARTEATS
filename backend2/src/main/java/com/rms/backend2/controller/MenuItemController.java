package com.rms.backend2.controller;

import com.rms.backend2.model.MenuItem;
import com.rms.backend2.service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuItemController {

    private final MenuItemService service;

    // ALWAYS upload into project-root/uploads
    private final String rootUploadDir = System.getProperty("user.dir") + "/uploads/";

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return service.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MenuItem createMenuItem(@RequestBody MenuItem item) {
        return service.addItem(item);
    }

    @PostMapping(path = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<MenuItem> uploadMenuItem(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        String imagePath = null;

        if (file != null && !file.isEmpty()) {

            Path uploadPath = Paths.get(rootUploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = System.currentTimeMillis() + "_" + original;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            imagePath = "/uploads/" + filename;
        }

        MenuItem item = new MenuItem();
        item.setName(name);
        item.setCategory(category);
        item.setPrice(price);
        item.setDescription(description);
        item.setStatus(status != null ? status : "available");
        item.setImage(imagePath);
        item.setPopularity(0);

        return ResponseEntity.ok(service.addItem(item));
    }

    @PutMapping(path = "/update", consumes = {"multipart/form-data"})
    public ResponseEntity<MenuItem> updateMenuItemMultipart(
            @RequestParam("id") Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        MenuItem existing = service.getItemById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        if (name != null) existing.setName(name);
        if (category != null) existing.setCategory(category);
        if (price != null) existing.setPrice(price);
        if (description != null) existing.setDescription(description);
        if (status != null) existing.setStatus(status);

        if (file != null && !file.isEmpty()) {
            Path uploadPath = Paths.get(rootUploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = System.currentTimeMillis() + "_" + original;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            existing.setImage("/uploads/" + filename);
        }

        return ResponseEntity.ok(service.addItem(existing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateJsonMenuItem(@PathVariable Long id, @RequestBody MenuItem item) {
        return ResponseEntity.ok(service.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
