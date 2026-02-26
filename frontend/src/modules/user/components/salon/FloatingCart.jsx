import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Sparkles } from "lucide-react";
import { useCart } from "@/modules/user/contexts/CartContext";
import { useAuth } from "@/modules/user/contexts/AuthContext";

const FloatingCart = ({ isVisible = true }) => {
    const { cartItems, totalItems, totalPrice, setIsCartOpen, isCartOpen } = useCart();
    const { isLoggedIn } = useAuth();

    // Only show if user is logged in AND has items AND cart is not already open AND external isVisible is true
    if (totalItems === 0 || !isLoggedIn || isCartOpen || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-24 lg:bottom-24 left-4 right-4 z-[100] max-w-xs sm:max-w-md mx-auto pointer-events-none"
            >
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-2xl shadow-2xl shadow-green-500/30 flex items-center justify-between group overflow-hidden relative pointer-events-auto"
                >
                    {/* Shine Effect */}
                    <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12"
                    />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute -top-2 -right-2 bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-green-600">
                                {totalItems}
                            </span>
                        </div>
                        <div className="text-left">
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider leading-none">Your Cart</p>
                            <p className="text-white text-lg font-bold">₹{totalPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/20 py-2 px-4 rounded-xl border border-white/30 backdrop-blur-md group-hover:bg-white/30 transition-all relative z-10">
                        <span className="text-white text-sm font-bold">View Cart</span>
                        <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                    </div>

                    <Sparkles className="absolute -top-1 right-20 w-4 h-4 text-white/40 animate-pulse" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingCart;

