import CategoryService from "./CategoryService.js";
import Service from "./Service.js";
import ServicePrice from "./ServicePrice.js";
import Customer from "./Customer.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import OnlineOrder from "./OnlineOrder.js";
import OnlineOrderItem from "./OnlineOrderItem.js";

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

// ========================================
// ONLINE ORDER -> ONLINE ORDER ITEMS
// hapus pesanan online = hapus semua itemnya
// ========================================

OnlineOrder.hasMany(OnlineOrderItem, {
  foreignKey: "onlineOrderId",
  as: "items",
  onDelete: "CASCADE",
});

OnlineOrderItem.belongsTo(OnlineOrder, {
  foreignKey: "onlineOrderId",
  as: "onlineOrder",
  onDelete: "CASCADE",
});

// ========================================
// ONLINE ORDER ITEM -> data master layanan
// alias dibedakan (onlineOrderItems) agar tidak bentrok dengan orderItems
// ========================================

CategoryService.hasMany(OnlineOrderItem, {
  foreignKey: "categoryId",
  as: "onlineOrderItems",
  onDelete: "RESTRICT",
});

OnlineOrderItem.belongsTo(CategoryService, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "RESTRICT",
});

Service.hasMany(OnlineOrderItem, {
  foreignKey: "serviceId",
  as: "onlineOrderItems",
  onDelete: "RESTRICT",
});

OnlineOrderItem.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
  onDelete: "RESTRICT",
});

ServicePrice.hasMany(OnlineOrderItem, {
  foreignKey: "servicePriceId",
  as: "onlineOrderItems",
  onDelete: "RESTRICT",
});

OnlineOrderItem.belongsTo(ServicePrice, {
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
  OnlineOrder,
  OnlineOrderItem,
};