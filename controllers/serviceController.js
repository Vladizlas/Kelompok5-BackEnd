import {
  Service,
  CategoryService,
  ServicePrice,
  OrderItem,
} from "../models/index.js";

// ========================================
// VALIDASI SERVICE
// ========================================
const validateService = (categoryId, name, description) => {
  if (
    categoryId === undefined ||
    categoryId === null ||
    categoryId === ""
  ) {
    return "Kategori layanan wajib dipilih";
  }

  if (!Number.isInteger(Number(categoryId))) {
    return "Kategori layanan tidak valid";
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Nama layanan wajib diisi";
  }

  if (name.trim().length > 100) {
    return "Nama layanan maksimal 100 karakter";
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return "Deskripsi harus berupa teks";
  }

  return null;
};

// ========================================
// GET ALL SERVICES
// ========================================
export const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: CategoryService,
          as: "category",
        },
        {
          model: ServicePrice,
          as: "prices",
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data layanan berhasil diambil",
      data: services,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SERVICE BY ID
// ========================================
export const getService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id, {
      include: [
        {
          model: CategoryService,
          as: "category",
        },
        {
          model: ServicePrice,
          as: "prices",
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data layanan berhasil diambil",
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CREATE SERVICE
// ========================================
export const createService = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
    } = req.body;

    const validationError = validateService(
      categoryId,
      name,
      description
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const category = await CategoryService.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori layanan tidak ditemukan",
      });
    }

    const service = await Service.create({
      categoryId: Number(categoryId),
      name: name.trim(),
      description: description?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: "Layanan berhasil ditambahkan",
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE SERVICE
// ========================================
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoryId,
      name,
      description,
    } = req.body;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }

    const validationError = validateService(
      categoryId,
      name,
      description
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const category = await CategoryService.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori layanan tidak ditemukan",
      });
    }

    await service.update({
      categoryId: Number(categoryId),
      name: name.trim(),
      description: description?.trim() || null,
    });

    res.status(200).json({
      success: true,
      message: "Layanan berhasil diupdate",
      data: service,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE SERVICE
// ========================================
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Layanan tidak ditemukan",
      });
    }

    // Cek apakah layanan sudah dipakai order
    const orderCount = await OrderItem.count({
      where: {
        serviceId: id,
      },
    });

    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Layanan tidak dapat dihapus karena sudah dipakai pada order.",
      });
    }

    // Hapus semua harga milik service
    await ServicePrice.destroy({
      where: {
        serviceId: id,
      },
    });

    // Hapus service
    await service.destroy();

    res.status(200).json({
      success: true,
      message: "Layanan dan harga berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
