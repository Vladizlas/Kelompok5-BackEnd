import CategoryService from "./CategoryService.js";
import Service from "./Service.js";
import ServicePrice from "./ServicePrice.js";
import Customer from "./Customer.js";
import Order from "./Order.js";

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

// ========================================
// ORDER
// onDelete RESTRICT: data master (customer, kategori,
// layanan, harga) yang sudah dipakai order tidak boleh
// ikut menghapus order secara diam-diam.
// ========================================

Customer.hasMany(Order, {
  foreignKey: "customerId",
  as: "orders",
  onDelete: "RESTRICT",
});

Order.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
  onDelete: "RESTRICT",
});

CategoryService.hasMany(Order, {
  foreignKey: "categoryId",
  as: "orders",
  onDelete: "RESTRICT",
});

Order.belongsTo(CategoryService, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "RESTRICT",
});

Service.hasMany(Order, {
  foreignKey: "serviceId",
  as: "orders",
  onDelete: "RESTRICT",
});

Order.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
  onDelete: "RESTRICT",
});

ServicePrice.hasMany(Order, {
  foreignKey: "servicePriceId",
  as: "orders",
  onDelete: "RESTRICT",
});

Order.belongsTo(ServicePrice, {
  foreignKey: "servicePriceId",
  as: "servicePrice",
  onDelete: "RESTRICT",
});

export {
  CategoryService,
  Service,
  ServicePrice,
  Customer,
  Order,
};