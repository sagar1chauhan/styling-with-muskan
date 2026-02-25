import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Search, Filter, ChevronDown, Star,
    Clock, Plus, ShoppingCart, Share2, Info, RefreshCcw, Heart
} from "lucide-react";
import { services, categories } from "@/modules/user/data/services";
import { useGenderTheme } from "@/modules/user/contexts/GenderThemeContext";
import { useCart } from "@/modules/user/contexts/CartContext";
import { useAuth } from "@/modules/user/contexts/AuthContext";
import { useWishlist } from "@/modules/user/contexts/WishlistContext";
import { Button } from "@/modules/user/components/ui/button";
import { shareContent } from "@/modules/user/lib/utils";
import FloatingCart from "@/modules/user/components/salon/FloatingCart";
import ExpressCheckout from "@/modules/user/components/salon/ExpressCheckout";
import FilterModal from "@/modules/user/components/salon/FilterModal";

const ExplorePage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { gender } = useGenderTheme();
    const { totalItems, addToCart } = useCart();
    const { isLoggedIn, setIsLoginModalOpen } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q') || "";

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [activeCategory, setActiveCategory] = useState(categoryId || "facial");
    const [activeFilter, setActiveFilter] = useState("Top Selling");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        concern: null,
        skinType: null,
        other: null,
        priceRange: null
    });

    // Sync active category and search query with URL
    useEffect(() => {
        if (categoryId) {
            setActiveCategory(categoryId);
        }
    }, [categoryId]);

    useEffect(() => {
        if (queryParam) {
            setSearchQuery(queryParam);
        }
    }, [queryParam]);

    const filteredCategories = useMemo(() =>
        categories.filter(c => c.gender === gender),
        [gender]
    );

    const filteredServices = useMemo(() => {
        return services.filter(s => {
            const matchesGender = s.gender === gender;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase());

            // If searching, allow results from any category in this gender
            const matchesCategory = searchQuery.length > 0 ? true : s.category === activeCategory;

            // Filtering logic based on activeFilter
            let matchesFilter = true;
            if (activeFilter === "Top Selling") matchesFilter = s.rating >= 4.7;
            else if (activeFilter === "Premium") matchesFilter = s.price > 2000;
            else if (activeFilter === "Classic") matchesFilter = s.price <= 2000 && s.price > 500;
            else if (activeFilter === "Express") matchesFilter = s.duration && (s.duration.includes("min") && parseInt(s.duration) <= 45);
            else if (activeFilter === "Treatments") matchesFilter = s.name.toLowerCase().includes("treatment") || s.description.toLowerCase().includes("treatment");

            // Modal Preference Filters
            let matchesConcern = true;
            if (preferences.concern) {
                matchesConcern = s.name.toLowerCase().includes(preferences.concern.split('/')[0].trim().toLowerCase()) ||
                    s.description.toLowerCase().includes(preferences.concern.split('/')[0].trim().toLowerCase());
            }

            let matchesSkinType = true;
            if (preferences.skinType && preferences.skinType !== "All Skin Types") {
                const skinType = preferences.skinType.replace(" Skin", "").toLowerCase();
                matchesSkinType = s.description.toLowerCase().includes(skinType) ||
                    s.name.toLowerCase().includes(skinType) ||
                    s.description.toLowerCase().includes("all skin types");
            }

            let matchesOther = true;
            if (preferences.other) {
                matchesOther = s.name.toLowerCase().includes(preferences.other.toLowerCase()) ||
                    s.description.toLowerCase().includes(preferences.other.toLowerCase());
            }

            let matchesPrice = true;
            if (preferences.priceRange) {
                const price = s.price;
                if (preferences.priceRange === "Under ₹999") matchesPrice = price < 999;
                else if (preferences.priceRange === "Above ₹1999") matchesPrice = price > 1999;
                else if (preferences.priceRange.includes("-")) {
                    const [min, max] = preferences.priceRange.replace(/₹/g, "").split("-").map(v => parseInt(v.trim()));
                    matchesPrice = price >= min && price <= max;
                }
            }

            return matchesCategory && matchesGender && matchesSearch && matchesFilter && matchesConcern && matchesSkinType && matchesOther && matchesPrice;
        });
    }, [activeCategory, gender, searchQuery, activeFilter, preferences]);

    const filters = ["Top Selling", "Premium", "Classic", "Express", "Treatments"];

    const handleAddToCart = (service) => {
        if (!isLoggedIn) {
            setIsLoginModalOpen(true);
            return;
        }
        addToCart(service);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-strong border-b border-border shadow-soft">
                <div className="px-4 py-3 max-w-4xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate("/home")}
                        className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors" />
                        <input
                            type="text"
                            placeholder={searchQuery ? "Searching..." : `Search ${filteredCategories.find(c => c.id === activeCategory)?.name || 'category'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-border/50 text-base focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-xs"
                        />
                    </div>

                    <button
                        onClick={() => shareContent({
                            title: 'Salon Services - Styling with Muskan',
                            text: `Check out these ${activeCategory} services!`,
                            url: window.location.href,
                        })}
                        className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Category Switcher */}
                <div className="flex gap-6 overflow-x-auto hide-scrollbar px-5 py-3 max-w-4xl mx-auto items-center">
                    {filteredCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                navigate(`/explore/${cat.id}`, { replace: true });
                            }}
                            className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all duration-300 ${activeCategory === cat.id ? "opacity-100 scale-105" : "opacity-50 grayscale hover:opacity-80"
                                }`}
                        >
                            <div className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${activeCategory === cat.id ? "border-primary shadow-md ring-2 ring-primary/10" : "border-transparent"
                                }`}>
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-[11px] font-bold ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`}>
                                {cat.name}
                            </span>
                            {activeCategory === cat.id && (
                                <motion.div layoutId="cat-active" className="h-0.5 w-6 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 mt-4">
                {/* Filter Rows */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 relative">
                    <Button
                        variant={Object.values(preferences).some(v => v !== null) ? "default" : "outline"}
                        size="sm"
                        className="rounded-full gap-2 text-xs h-9 px-4 font-bold border-2"
                        onClick={() => setIsFilterModalOpen(true)}
                    >
                        <Filter className="w-3.5 h-3.5 mr-0.5" /> Skin Type / Concerns
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-2 text-xs h-9 px-4 font-bold border-2"
                        onClick={() => {
                            setPreferences({
                                concern: null,
                                skinType: null,
                                other: null,
                                priceRange: null
                            });
                            setActiveFilter("Top Selling");
                        }}
                    >
                        <RefreshCcw className="w-3.5 h-3.5" /> Clear
                    </Button>
                </div>

                {/* Dynamic Filter Tags */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${activeFilter === f
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-accent text-muted-foreground border-transparent hover:border-border"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Service Section Label */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {activeFilter}
                    <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                        {filteredServices.length} Results
                    </span>
                </h2>

                {/* Service Cards */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-strong rounded-3xl overflow-hidden shadow-soft border border-border/50 group"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Image Side */}
                                    <div className="relative w-full md:w-56 h-48 md:h-auto overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-primary shadow-sm flex items-center gap-1 z-10">
                                            <Clock className="w-3 h-3" /> {service.duration}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(service);
                                            }}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full glass-strong flex items-center justify-center backdrop-blur-md z-10 active:scale-90 transition-transform"
                                        >
                                            <Heart className={`w-4 h-4 transition-colors ${isInWishlist(service.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                                        </button>
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/service/${service.id}`)}>
                                                    {service.name}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-amber-400/10 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold">
                                                    <Star className="w-3 h-3 fill-amber-600" /> {service.rating}
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-1">
                                                {service.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-bold text-primary">₹{service.price}</span>
                                                    {service.originalPrice && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs text-muted-foreground line-through opacity-60">
                                                                ₹{service.originalPrice}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {service.originalPrice && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-600/10 w-fit px-1.5 py-0.5 rounded">
                                                        {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/service/${service.id}`)}
                                                className="rounded-xl h-9 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold uppercase tracking-wider text-[11px]"
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredServices.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">No services found in this category.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Trust Quote */}
            <div className="max-w-4xl mx-auto px-4 mt-8 pb-10">
                <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-bold text-primary leading-tight uppercase tracking-wider">
                        Explore Dermat Recommended Services & Book Your Session
                    </p>
                </div>
            </div>

            <FloatingCart />
            <ExpressCheckout />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={preferences}
                onApply={(newFilters) => {
                    setPreferences(newFilters);
                    setIsFilterModalOpen(false);
                }}
            />
        </div >
    );
};

export default ExplorePage;

