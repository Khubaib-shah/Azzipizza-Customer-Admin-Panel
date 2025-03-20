import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { PiMotorcycle } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import Context from "../../context";
import CartCard from "../cards/cart.card";

function SideBar() {
  const [activeBar, setActiveBar] = useState("activeOne");
  const { cartItems, setCartItems } = useContext(Context);

  console.log(cartItems);
  return (
    <aside className="py-5">
      <div className="mb-4 flex items-center flex-col">
        <h1 className="text-xl font-bold">Carrello</h1>
        <div className="row32 flex items-center mt-4 bg-[#E6E3DE] p-1 w-full !rounded-full">
          <div className="w-[50%]">
            <Button
              onClick={() => setActiveBar("activeOne")}
              className={`transition w-full !text-md !text-[#000] !font-[500] !rounded-full flex gap-2 ${
                activeBar === "activeOne" ? "!bg-white" : "!bg-none"
              }`}
            >
              <PiMotorcycle className="text-[18px]" /> Consegna
            </Button>
          </div>
          <div className="w-[50%]">
            <Button
              onClick={() => setActiveBar("activeTwo")}
              className={`transition w-full !text-md !text-[#000] !font-[500] !rounded-full flex gap-2 ${
                activeBar === "activeTwo" ? "!bg-white" : "!bg-none"
              }`}
            >
              <MdOutlineIndeterminateCheckBox className="text-[18px]" /> Ritiro
            </Button>
          </div>
        </div>

        <div className="w-full mt-4">
          <div
            className={`no-item flex flex-col gap-2 items-center justify-center w-full h-[300px] ${
              cartItems.length > 0 ? "hidden" : "block"
            }`}
          >
            <RiDeleteBin5Line className="text-[60px]" />
            <h1 className="text-xl font-bold">Riempi il carrello</h1>
            <p className="text-md">Il carrello è vuoto</p>
          </div>

          <div className="cart-items w-full">
            {cartItems.map((item, index) => (
              <CartCard key={index} products={item} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
