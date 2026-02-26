import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Zap, CalendarClock, ArrowLeft } from "lucide-react";
import { useGenderTheme } from "@/modules/user/contexts/GenderThemeContext";
import { useCart } from "@/modules/user/contexts/CartContext";
import { categories, SERVICE_TYPES, BOOKING_TYPE_CONFIG } from "@/modules/user/data/services";
import CustomizeBookingForm from "./CustomizeBookingForm";

const CategoryGrid = () => {
  const { gender } = useGenderTheme();
  const navigate = useNavigate();
  const { bookingType, setBookingType } = useCart();
  const [step, setStep] = useState(1); // 1: Booking Type, 2: Service Type
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const handleBookingTypeSelect = (typeId) => {
    if (typeId === "customize") {
      setIsCustomizeOpen(true);
    } else {
      setBookingType(typeId);
      setStep(2);
    }
  };

  // Group categories into Main Service Types for the home page
  const mainServiceTypes = SERVICE_TYPES.map(type => ({
    ...type,
    // Find the first category in this type to use as the entry point
    entryCategory: categories.find(c => c.serviceType === type.id && c.gender === gender)?.id
  })).filter(t => t.entryCategory);

  return (
    <>
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-black mb-0.5 ${gender === "women" ? "font-display" : "font-heading-men"}`}>
              {step === 1 ? "How would you like to book?" : "What are you looking for?"}
            </h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              {step === 1 ? "Select your preferred service speed" : `Professional ${bookingType === 'instant' ? 'Instant' : 'Scheduled'} services`}
            </p>
          </div>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-3 h-3" /> CHANGE TYPE
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-3"
            >
              {BOOKING_TYPE_CONFIG.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBookingTypeSelect(type.id)}
                  className={`relative group overflow-hidden rounded-[24px] border-2 transition-all duration-300 p-5 flex items-center justify-between ${type.id === "customize"
                      ? "bg-black border-transparent text-white"
                      : "bg-white border-border hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${type.id === "customize" ? "bg-white/10" : "bg-accent"
                      }`}>
                      {type.icon}
                    </div>
                    <div className="text-left">
                      <h3 className={`text-lg font-black ${type.id === "customize" ? "text-white" : ""}`}>{type.label}</h3>
                      <p className={`text-[10px] font-bold tracking-tight ${type.id === "customize" ? "text-white/60" : "text-muted-foreground"}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${type.id === "customize" ? "bg-white/20" : "bg-primary/10"
                    }`}>
                    <ChevronRight className={`w-4 h-4 ${type.id === "customize" ? "text-white" : "text-primary"}`} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {mainServiceTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/explore/${type.entryCategory}?type=${type.id}&booking=${bookingType}`)}
                  className="relative group overflow-hidden rounded-[24px] border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10`} />
                  <div className="relative p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {type.icon}
                      </div>
                      <div className="text-left">
                        <h3 className={`text-lg font-black ${type.textColor}`}>{type.label}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-tight">{type.description}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${type.bgColor} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
                      <ChevronRight className={`w-4 h-4 ${type.textColor}`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CustomizeBookingForm
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />
    </>
  );
};

export default CategoryGrid;
