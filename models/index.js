import CategoryService from "./CategoryService.js";
import Service from "./Service.js";
import ServicePrice from "./ServicePrice.js";
import Customer from "./Customer.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";

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
// ORDER (header invoice)
// onDelete RESTRICT: customer yang sudah punya order
// tidak boleh terhapus diam-diam.
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

// ========================================
// ORDER -> ORDER ITEMS
// hapus order = hapus semua itemnya
// ========================================

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
});

// ========================================
// ORDER ITEM -> data master layanan
// RESTRICT: kategori / layanan / harga yang sudah dipakai
// invoice tidak boleh ikut menghapus rincian invoice.
// ========================================

CategoryService.hasMany(OrderItem, {
  foreignKey: "categoryId",
  as: "orderItems",
  onDelete: "RESTRICT",
});

OrderItem.belongsTo(CategoryService, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "RESTRICT",
});

Service.hasMany(OrderItem, {
  foreignKey: "serviceId",
  as: "orderItems",
  onDelete: "RESTRICT",
});

OrderItem.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
  onDelete: "RESTRICT",
});

ServicePrice.hasMany(OrderItem, {
  foreignKey: "servicePriceId",
  as: "orderItems",
  onDelete: "RESTRICT",
});

OrderItem.belongsTo(ServicePrice, {
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
  OrderItem,
};
