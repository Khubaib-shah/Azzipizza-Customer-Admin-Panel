import Menu from "../models/MenuModel.js";
import cloudinary from "../utils/cloudinary.js";

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu item", error });
  }
};

// Create a new menu item
export const createMenuItem = async (req, res) => {
  const { name, description, price, image, category, ingredients } = req.body;

  try {
    if (!name || !description || !price || !image || !category) {
      req.status(400).json({ message: "All field are mandatory" });
    }
    const menuPicture = await cloudinary.uploader.upload(image);

    const menuObject = {
      name,
      description,
      price,
      image: menuPicture.secure_url,
      category,
      ingredients,
    };
    const newMenuItem = new Menu(menuObject);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error });
  }
};

// Update an existing menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error });
  }
};
