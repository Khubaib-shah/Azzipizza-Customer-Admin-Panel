import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const EditProductDialog = ({
  editDialogOpen,
  setEditDialogOpen,
  itemToEdit,
  handleEditChange,
  handleEditSubmit,
  categories,
  newIngredient,
  setNewIngredient,
  newIngredientPrice,
  setNewIngredientPrice,
  handleAddIngredient,
  handleRemoveIngredient,
  handleFileChange,
  imagePreview,
  loading,
}) => {
  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update the details of this menu item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  placeholder="Item Name"
                  value={itemToEdit.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Description"
                  value={itemToEdit.description}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={itemToEdit.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (%)</label>
                <Input
                  type="number"
                  placeholder="Enter discount %"
                  value={itemToEdit.discount || ""}
                  onChange={(e) => handleEditChange("discount", e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              {itemToEdit.price && itemToEdit.discount > 0 && (
                <p className="text-sm text-green-600">
                  Discounted Price: €
                  {(
                    itemToEdit.price -
                    (itemToEdit.price * itemToEdit.discount) / 100
                  ).toFixed(2)}{" "}
                  ({itemToEdit.discount}% OFF)
                </p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={itemToEdit.category}
                  onValueChange={(value) => handleEditChange("category", value)}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="capitalize cursor-pointer"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredients</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Ingredient name"
                  />
                  <Input
                    type="number"
                    value={newIngredientPrice}
                    onChange={(e) => setNewIngredientPrice(e.target.value)}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    variant="outline"
                    size="sm"
                    className={
                      newIngredient && newIngredientPrice && "cursor-pointer"
                    }
                    disabled={!newIngredient || !newIngredientPrice}
                  >
                    Add
                  </Button>
                </div>

                {itemToEdit.ingredients?.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {itemToEdit.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex-1">{ingredient.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            €{ingredient.price.toFixed(2)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1 h-6 w-6 cursor-pointer"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview || itemToEdit.image ? (
                    <div className="space-y-3">
                      <img
                        src={
                          imagePreview ||
                          (typeof itemToEdit.image === "string"
                            ? itemToEdit.image
                            : URL.createObjectURL(itemToEdit.image))
                        }
                        alt="Preview"
                        className="mx-auto h-40 object-contain rounded"
                      />
                      <div className="flex gap-2 flex-col">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer w-full"
                          onClick={() =>
                            document.getElementById("editImageInput").click()
                          }
                        >
                          Change Image
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setImagePreview(null);
                            handleEditChange("image", null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        id="editImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Upload an image
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                        onClick={() =>
                          document.getElementById("editImageInput").click()
                        }
                      >
                        Select Image
                      </Button>
                      <Input
                        id="editImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setEditDialogOpen(false);
                setImagePreview(null);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
