import CategoryService from "./CategoryService.js";
import Service from "./Service.js";
import ServicePrice from "./ServicePrice.js";

// ========================================
// CATEGORY SERVICE -> SERVICE
// ========================================

CategoryService.hasMany(Service, {
  foreignKey: "categoryId",
  as: "services",
});

Service.belongsTo(CategoryService, {
  foreignKey: "categoryId",
  as: "category",
});

// ========================================
// SERVICE -> SERVICE PRICE
// ========================================

Service.hasMany(ServicePrice, {
  foreignKey: "serviceId",
  as: "prices",
});

ServicePrice.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

export {
  CategoryService,
  Service,
  ServicePrice,
};
