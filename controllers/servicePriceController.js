import { ServicePrice, Service } from "../models/index.js";

// ========================================
// VALIDASI SERVICE PRICE
// ========================================
const validateServicePrice = (
  serviceId,
  itemType,
  price,
  unit
) => {
  if (
    serviceId === undefined ||
    serviceId === null ||
    serviceId === ""
  ) {
    return "Service wajib dipilih";
  }

  if (!Number.isInteger(Number(serviceId))) {
    return "Service tidak valid";
  }

  if (
    !itemType ||
    typeof itemType !== "string" ||
    itemType.trim() === ""
  ) {
    return "Jenis item wajib diisi";
  }

  if (itemType.trim().length > 100) {
    return "Jenis item maksimal 100 karakter";
  }

  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return "Harga wajib diisi";
  }

  if (!Number.isInteger(Number(price))) {
    return "Harga harus berupa angka";
  }

  if (Number(price) < 0) {
    return "Harga tidak boleh negatif";
  }

  if (!["kg", "pcs"].includes(unit)) {
    return "Unit harus berupa kg atau pcs";
  }

  return null;
};

// ========================================
// GET ALL
// ========================================
export const getServicePrices = async (req, res) => {
  try {
    const prices = await ServicePrice.findAll({
      include: [
        {
          model: Service,
          as: "service",
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data harga layanan berhasil diambil",
      data: prices,
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
// GET BY ID
// ========================================
export const getServicePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await ServicePrice.findByPk(id, {
      include: [
        {
          model: Service,
          as: "service",
        },
      ],
    });

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Harga layanan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data harga layanan berhasil diambil",
      data: price,
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
// CREATE
// ========================================
export const createServicePrice = async (req, res) => {
  try {
    const {
      serviceId,
      itemType,
      price,
      unit,
    } = req.body;

    const validationError = validateServicePrice(
      serviceId,
      itemType,
      price,
      unit
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service tidak ditemukan",
      });
    }

    const servicePrice = await ServicePrice.create({
      serviceId: Number(serviceId),
      itemType: itemType.trim(),
      price: Number(price),
      unit,
    });

    res.status(201).json({
      success: true,
      message: "Harga layanan berhasil ditambahkan",
      data: servicePrice,
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
// UPDATE
// ========================================
export const updateServicePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      serviceId,
      itemType,
      price,
      unit,
    } = req.body;

    const servicePrice = await ServicePrice.findByPk(id);

    if (!servicePrice) {
      return res.status(404).json({
        success: false,
        message: "Harga layanan tidak ditemukan",
      });
    }

    const validationError = validateServicePrice(
      serviceId,
      itemType,
      price,
      unit
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service tidak ditemukan",
      });
    }

    await servicePrice.update({
      serviceId: Number(serviceId),
      itemType: itemType.trim(),
      price: Number(price),
      unit,
    });

    res.status(200).json({
      success: true,
      message: "Harga layanan berhasil diupdate",
      data: servicePrice,
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
// DELETE
// ========================================
export const deleteServicePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const servicePrice = await ServicePrice.findByPk(id);

    if (!servicePrice) {
      return res.status(404).json({
        success: false,
        message: "Harga layanan tidak ditemukan",
      });
    }

    await servicePrice.destroy();

    res.status(200).json({
      success: true,
      message: "Harga layanan berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
