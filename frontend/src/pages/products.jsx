import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CurrencyContext } from "../context/CurrencyContext";
import API_URL from "../config/api";

const Products = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currency, exchangeRate } = useContext(CurrencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/catalog/products?subcategory=${subcategoryId}`
        );
        setProducts(response.data);
        setError("");
      } catch (error) {
        setError("Error fetching products. Please try again.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subcategoryId]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-2">
            Browse
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brand-black">
            Products
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-brand-border border-t-brand-black rounded-full animate-spin" />
          </div>

        ) : error ? (
          <div className="text-center py-32">
            <p className="font-body text-brand-muted">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn-outline"
            >
              Try Again
            </button>
          </div>

        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <svg className="w-16 h-16 text-brand-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="font-heading text-xl text-brand-text mb-2">No products found</p>
            <p className="font-body text-sm text-brand-muted">Check back later for new arrivals.</p>
          </div>

        ) : (
          <>
            {/* Product Count */}
            <p className="font-body text-xs text-brand-muted mb-6">
              {products.length} product{products.length > 1 ? "s" : ""}
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
              {products.map((product) => {
                const imageUrl = product.images?.[0]
                  ? `${API_URL}/${product.images[0]}`
                  : "/images/placeholder.jpg";

                const priceLKR = product.priceLKR ?? 0;
                const priceJPY = product.priceJPY ?? 0;
                const priceToUse = currency === "LKR" ? priceLKR : priceJPY;
                const convertedPrice =
                  currency === "JPY"
                    ? priceToUse.toFixed(2)
                    : (priceToUse * exchangeRate).toFixed(2);
                const currencySymbol = currency === "LKR" ? "LKR" : "¥";

                return (
                  <div
                    key={product._id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/products/details/${product._id}`)}
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden bg-brand-surface mb-3">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="font-body text-sm font-medium text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-brand-muted">
                      {currencySymbol} {convertedPrice}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;