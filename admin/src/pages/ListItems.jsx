import React, { useEffect, useState } from "react";
import { baseUri } from "../config/config";
import { Trash2, Search, Filter, AlertCircle, Edit, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import EditProductDialog from "../components/EditProductDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data } = await baseUri.get("/api/menu");
        setItems(data);
        setFilteredItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu items. Please try again.");
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    let result = items;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
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
    setError("");
    try {
      await baseUri.delete(`/api/menu/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      setDeleteDialogOpen(false);
      setLoading(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "" && newIngredientPrice.trim() !== "") {
      setItemToEdit((prev) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            name: newIngredient.trim(),
            price: parseFloat(newIngredientPrice) || 0,
          },
        ],
      }));
      setNewIngredient("");
      setNewIngredientPrice("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setItemToEdit((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleEditChange = (field, value) => {
    setItemToEdit((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemToEdit((prev) => ({ ...prev, image: file }));

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", itemToEdit.name);
      formData.append("description", itemToEdit.description);
      formData.append("price", itemToEdit.price);
      formData.append("category", itemToEdit.category);
      formData.append("ingredients", JSON.stringify(itemToEdit.ingredients));

      if (itemToEdit.image && typeof itemToEdit.image !== "string") {
        formData.append("image", itemToEdit.image);
      }

      const { data } = await baseUri.put(
        `/api/menu/${itemToEdit._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setItems((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
      setLoading(false);
      setEditDialogOpen(false);
      setImagePreview(null);
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again.");
    }
  };

  const categories = [
    "pizze rosse",
    "pizze bianche",
    "fritti",
    "dolci",
    "bibite",
    "birre",
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto ">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl  font-bold text-gray-900">Menu Items</h1>
            <p className="text-gray-500 mt-1">
              Manage your restaurant menu items
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-9 w-full lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={categoryFilter || "all"}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>{" "}
                {/* Change value from "" to "all" */}
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Filter className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No items found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || categoryFilter
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "You haven't added any menu items yet. Start by adding your first item."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item._id} className="overflow-hidden capitalize">
                <div className="relative h-48 bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-full shadow-md hover:bg-white/70 transition-all cursor-pointer duration-200 ease-in-out p-2.5">
                        <Edit3 className="size-6 text-white" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                          onClick={() => {
                            setItemToEdit(item);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1 text-blue-500 hover:text-blue-600" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          onClick={() => confirmDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-full capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      onClick={() => confirmDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteProductDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        itemToDelete={itemToDelete}
        handleDelete={handleDelete}
        loading={loading}
      />

      {/* Edit Dialog */}
      <EditProductDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        itemToEdit={itemToEdit}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        categories={categories}
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
        newIngredientPrice={newIngredientPrice}
        setNewIngredientPrice={setNewIngredientPrice}
        handleAddIngredient={handleAddIngredient}
        handleRemoveIngredient={handleRemoveIngredient}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        loading={loading}
      />
    </>
  );
};

export default ListItems;
