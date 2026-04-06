package com.rms.backend2.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private String status;
    private String description;

    /**
     * This stores the accessible URL/path to the saved image, for example:
     * /uploads/filename.jpg  OR http://localhost:8080/uploads/filename.jpg
     */
    private String image;

    private Integer popularity;

    public MenuItem() {}

    public MenuItem(Long id, String name, String category, Double price,
                    String status, String description, String image, Integer popularity) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.status = status;
        this.description = description;
        this.image = image;
        this.popularity = popularity;
    }

    public MenuItem(Long id, String name, String category, Double price,
                    String status, String description, String image) {
        this(id, name, category, price, status, description, image, 0);
    }

    // getters & setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getPopularity() { return popularity; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }

    @Override
    public String toString() {
        return "MenuItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", popularity=" + popularity +
                '}';
    }
}
