import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGenderTheme } from "@/modules/user/contexts/GenderThemeContext";
import { categories } from "@/modules/user/data/services";

const CategoryGrid = () => {
  const { gender } = useGenderTheme();
  const navigate = useNavigate();
  const filtered = categories.filter((c) => c.gender === gender);
  const [imgError, setImgError] = useState({});

  const handleImageError = (catId) => {
    setImgError((prev) => ({ ...prev, [catId]: true }));
  };

  return (
    <div className="px-4 mt-4">
      <h2
        className={`text-lg font-bold mb-4 ${gender === "women" ? "font-display" : "font-heading-men"
          }`}
      >
        Explore Our Categories
      </h2>
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-x-3 gap-y-4">
        {filtered.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/explore/${cat.id}`)}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Image Circle */}
            <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 rounded-2xl overflow-hidden shadow-soft group-hover:shadow-elevated group-hover:glow-primary transition-all duration-300 border-2 border-border/50 group-hover:border-primary/40 bg-accent">
              {cat.image && !imgError[cat.id] ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={() => handleImageError(cat.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {cat.icon}
                </div>
              )}

              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Label */}
            <span className="text-[11px] md:text-xs font-medium text-center leading-tight group-hover:text-primary transition-colors duration-200">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

