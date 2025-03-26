function MenuModal({ menuItems, onClose, onSelectCategory }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-xl shadow-xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold">Menu Items</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold p-2 rounded hover:bg-red-100"
          >
            ✖
          </button>
        </div>
        <ul className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {menuItems?.map((item, index) => (
            <li
              key={index}
              className="text-lg cursor-pointer p-3 bg-white text-black hover:bg-black hover:text-white rounded-md transition"
              onClick={() => {
                onSelectCategory(item);
                onClose();
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default MenuModal;
