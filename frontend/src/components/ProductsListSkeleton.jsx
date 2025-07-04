const ProductsListSkeleton = () => {
  return (
    <div className="container mx-auto px-4 pt-5 mt-3">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-3/4 sm:w-1/2 animate-pulse"></div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      <div className="h-12 bg-gray-200 rounded-full animate-pulse mb-6"></div>

      <div className="flex gap-2 mb-6 overflow-x-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"
          ></div>
        ))}
      </div>

      {[...Array(3)].map((_, catIndex) => (
        <div key={catIndex} className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>

          <div className="flex gap-4 overflow-x-hidden">
            {[...Array(4)].map((_, prodIndex) => (
              <div key={prodIndex} className="flex-shrink-0 w-[250px]">
                <div className="h-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="h-40 bg-gray-200 rounded-lg animate-pulse mt-8"></div>
    </div>
  );
};

export default ProductsListSkeleton;
