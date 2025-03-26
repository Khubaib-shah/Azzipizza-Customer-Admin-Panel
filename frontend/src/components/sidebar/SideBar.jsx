import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { PiMotorcycle } from "react-icons/pi";
import { RiShoppingCartLine } from "react-icons/ri";
import Context from "../../context/dataContext";
import CartCard from "../Cart/CartCard";
import { MdOutlineTakeoutDining } from "react-icons/md";

function SideBar() {
  const [activeTab, setActiveTab] = useState("delivery");
  const { cartItems } = useContext(Context);

  const tabs = [
    { id: "delivery", icon: <PiMotorcycle /> },
    { id: "pickup", icon: <MdOutlineTakeoutDining /> },
  ];

  const validCartItems =
    cartItems?.filter((item) => item?.id && item?.image && item?.name) || [];

  return (
    <aside className="sticky top-10 p-5">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-center">Your Cart</h1>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-full">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              fullWidth
              onClick={() => setActiveTab(tab.id)}
              className={`!rounded-full !transition-all ${
                activeTab === tab.id
                  ? "!bg-white !shadow-sm"
                  : "!bg-transparent"
              }`}
            >
              <span className="flex items-center gap-2">{tab.icon}</span>
            </Button>
          ))}
        </div>

        {/* Cart Content */}
        {validCartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <RiShoppingCartLine className="text-5xl mb-2" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p>Add some items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {validCartItems.map((item) => (
              <CartCard
                key={`${item.id}-${item.variant || "default"}`}
                product={item}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default SideBar;
