// src/pages/ListItems.js
import { TrashIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ListItems = () => {
  const [list, setList] = useState([]);
  // getting the data from our backend
  useEffect(() => {
    const fetch = async () => {
      const response = await axios
        .get("http://localhost:5000/api/menu")
        .then((res) => {
          setList(res.data);
        });
    };
    fetch();
  }, [list]);

  // console.log("list", list);


  const deleteItem =async(id)=>{
    try {
      const response =await axios.delete(`http://localhost:5000/api/menu/${id}`)
console.log("response =>" , response);


    } catch (error) {
      
      console.log("error =>" , error.message);
      
    }
    
  }

  return (
    <div className="animate-fadeIn p-6 rounded-lg max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Menu Items</h2>
      <div className="space-y-4">
        {list.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex gap-6 flex-col justify-around items-center">

                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <button onClick={() => deleteItem(item._id)} className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full" >
                  <TrashIcon />
                </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListItems;
