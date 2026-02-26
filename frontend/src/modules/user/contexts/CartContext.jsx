import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(() => {
        const savedSlot = localStorage.getItem("selectedSlot");
        return savedSlot ? JSON.parse(savedSlot) : null;
    });
    const [bookingType, setBookingType] = useState(() => {
        return localStorage.getItem("bookingType") || "instant";
    });


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("selectedSlot", JSON.stringify(selectedSlot));
    }, [selectedSlot]);

    useEffect(() => {
        localStorage.setItem("bookingType", bookingType);
    }, [bookingType]);



    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const totalSavings = cartItems.reduce((total, item) => {
        if (item.originalPrice) {
            return total + ((item.originalPrice - item.price) * (item.quantity || 1));
        }
        return total;
    }, 0);

    // Group items by serviceType (skin, hair, makeup) for Urban Company-style cart
    const getGroupedItems = () => {
        const groups = {};
        const groupLabels = { skin: "🧴 Skin Services", hair: "💇 Hair Services", makeup: "💄 Makeup Services" };
        cartItems.forEach(item => {
            const type = item.serviceType || "other";
            if (!groups[type]) {
                groups[type] = { label: groupLabels[type] || "Other Services", items: [], subtotal: 0 };
            }
            groups[type].items.push(item);
            groups[type].subtotal += item.price * (item.quantity || 1);
        });
        return groups;
    };

    const addToCart = (service) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === service.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === service.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prevItems, { ...service, quantity: 1 }];
        });
    };

    const updateQuantity = (serviceId, amount) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.id === serviceId) {
                    const newQuantity = (item.quantity || 1) + amount;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            }).filter(Boolean);
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                totalItems,
                totalPrice,
                totalSavings,
                isCartOpen,
                setIsCartOpen,
                selectedSlot,
                setSelectedSlot,
                bookingType,
                setBookingType,
                addToCart,
                updateQuantity,
                clearCart,
                getGroupedItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
