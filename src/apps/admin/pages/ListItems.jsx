import React, { useEffect, useState, useCallback } from "react";
import { menuService } from "@shared/services";
import { Trash2, Search, Filter, AlertCircle, Edit, Edit3, Loader2 } from "lucide-react";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Card, CardContent } from "@shared/components/ui/card";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import EditProductDialog from "../components/EditProductDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("pizze rosse");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    ingredients: [],
    image: null,
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientPrice, setNewIngredientPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllItems();
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error("[ListItems Fetch Error]:", error);
      setError("Mamma Mia! Failed to retrieve the menu gallery.");
      toast.error("Could not load masterpieces.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    let result = items;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter) {
      result = result.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredItems(result);
  }, [searchTerm, categoryFilter, items]);

  const handleDelete = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await menuService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Masterpiece removed from the gallery.");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("[ListItems Delete Error]:", error);
      toast.error("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", itemToEdit.name);
      formData.append("description", itemToEdit.description);
      formData.append("price", itemToEdit.price);
      formData.append("discount", parseFloat(itemToEdit.discount) || 0);
      formData.append("category", itemToEdit.category);
      formData.append("ingredients", JSON.stringify(itemToEdit.ingredients));

      if (itemToEdit.image && typeof itemToEdit.image !== "string") {
        formData.append("image", itemToEdit.image);
      }

      const response = await menuService.updateItem(itemToEdit._id, formData);
      setItems((prev) =>
        prev.map((item) => (item._id === response.data._id ? response.data : item))
      );
      toast.success("Masterpiece updated successfully.");
      setEditDialogOpen(false);
      setImagePreview(null);
    } catch (err) {
      console.error("[ListItems Update Error]:", err);
      toast.error("Failed to update masterpiece.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["pizze rosse", "pizze bianche", "fritti", "dolci", "bibite", "birre"];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black !text-slate-900 tracking-tight">
              Collection <span className="text-red-600 italic underline underline-offset-8 decoration-amber-400/40">Gallery</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Oversee the artisanal menu that defines your brand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="relative group flex-1 md:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
              <Input
                type="search"
                placeholder="Find a masterpiece..."
                className="pl-12 w-full bg-slate-50 border-none rounded-xl focus-visible:ring-red-600/10 font-medium h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-48 bg-slate-50 border-none rounded-xl focus:ring-red-600/10 font-bold text-slate-700 h-12 px-6">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 capitalize z-50 bg-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="cursor-pointer font-medium h-10 px-4">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <AnimatePresence mode="popLayout">
          {loading && items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-80 bg-white/20 backdrop-blur-sm rounded-4xl border border-white"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Gathering Masterpieces...</p>
              </div>
            </motion.div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-20 rounded-4xl text-center border border-slate-100 shadow-sm"
            >
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">No items found</h3>
              <p className="text-slate-400 font-medium">
                Try adjusting your search or filters to see your work.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card
                    className="group border-none shadow-premium bg-white rounded-4xl overflow-hidden hover-lift transition-all duration-500"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <div className="absolute top-4 right-4 z-20">
                        <button
                          onClick={() => {
                            setItemToEdit(item);
                            setEditDialogOpen(true);
                          }}
                          className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl border border-white/50 text-slate-700 hover:bg-white hover:text-blue-600 shadow-xl transition-all cursor-pointer"
                        >
                          <Edit3 className="size-5" />
                        </button>
                      </div>

                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-4 left-4">
                        <span className="bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60"></div>

                      <div className="absolute bottom-5 left-5 bg-white text-slate-950 px-5 py-2.5 rounded-[1.25rem] shadow-2xl">
                        <span className="text-xs font-black mr-0.5 opacity-40 italic">€</span>
                        <span className="text-2xl font-serif font-black italic tracking-tighter">
                          {parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-8 space-y-4">
                      <div>
                        <h3 className="text-xl font-serif font-black text-slate-900 mb-2 truncate">
                          {item.name}
                        </h3>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2 h-10">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-slate-50/80">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available</span>
                        </div>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteProductDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        itemToDelete={itemToDelete}
        handleDelete={handleDelete}
        loading={loading}
      />

      <EditProductDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        itemToEdit={itemToEdit}
        handleEditChange={(field, value) => setItemToEdit(prev => ({ ...prev, [field]: value }))}
        handleEditSubmit={handleEditSubmit}
        categories={categories}
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
        newIngredientPrice={newIngredientPrice}
        setNewIngredientPrice={setNewIngredientPrice}
        handleAddIngredient={() => {
          if (newIngredient.trim() !== "" && newIngredientPrice.trim() !== "") {
            setItemToEdit(prev => ({
              ...prev,
              ingredients: [...prev.ingredients, { name: newIngredient.trim(), price: parseFloat(newIngredientPrice) || 0 }]
            }));
            setNewIngredient("");
            setNewIngredientPrice("");
          }
        }}
        handleRemoveIngredient={(i) => setItemToEdit(prev => ({
          ...prev,
          ingredients: prev.ingredients.filter((_, idx) => idx !== i)
        }))}
        handleFileChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setItemToEdit(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
          }
        }}
        imagePreview={imagePreview}
        loading={loading}
      />
    </div>
  );
};

export default ListItems;
