import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Check, ChevronRight, Zap, CalendarClock, Settings2, Users, PartyPopper } from "lucide-react";
import { useCart } from "@/modules/user/contexts/CartContext";
import { useGenderTheme } from "@/modules/user/contexts/GenderThemeContext";
import { Button } from "@/modules/user/components/ui/button";

const BOOKING_TYPES = [
    {
        id: "instant",
        label: "Instant",
        icon: Zap,
        description: "Book now, get served within 60 minutes",
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-500",
        borderColor: "border-amber-500/30",
    },
    {
        id: "prebook",
        label: "Pre-Book",
        icon: CalendarClock,
        description: "Schedule for a future date & time slot",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-500",
        borderColor: "border-blue-500/30",
    },
    {
        id: "customized",
        label: "Customized",
        icon: Settings2,
        description: "Pick your own date, time & add-ons",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        textColor: "text-purple-500",
        borderColor: "border-purple-500/30",
    },
];

const SlotSelectionModal = ({ isOpen, onClose, onSave }) => {
    const { selectedSlot, setSelectedSlot, bookingType, setBookingType } = useCart();
    const { gender } = useGenderTheme();

    const [tempBookingType, setTempBookingType] = useState(bookingType || "prebook");
    const [tempDate, setTempDate] = useState(selectedSlot?.date || null);
    const [tempSlot, setTempSlot] = useState(selectedSlot?.time || null);
    const [tempNotes, setTempNotes] = useState("");
    const [eventType, setEventType] = useState("Home Service");
    const [peopleCount, setPeopleCount] = useState("1");

    // Reset temp values when modal opens or booking type changes
    useEffect(() => {
        if (isOpen) {
            setTempBookingType(bookingType || "prebook");
            setTempDate(selectedSlot?.date || null);
            setTempSlot(selectedSlot?.time || null);
        }
    }, [isOpen]);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            label: d.toLocaleDateString("en-IN", { weekday: "short" }),
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            key: d.toISOString().split("T")[0],
            isToday: i === 0,
        };
    });

    const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    const handleSave = () => {
        if (tempBookingType === "instant") {
            setSelectedSlot({ date: "Today", time: "Now (within 60 mins)", isInstant: true });
            setBookingType("instant");
            onSave?.();
            onClose();
        } else if (tempDate && tempSlot) {
            setSelectedSlot({
                date: tempDate,
                time: tempSlot,
                notes: tempNotes,
                eventType,
                peopleCount
            });
            setBookingType(tempBookingType);
            onSave?.();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-10 sm:items-center sm:p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-lg bg-background rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Fixed Header */}
                    <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background z-10">
                        <div>
                            <h2 className={`text-xl font-bold font-display uppercase tracking-tight`}>Booking Options</h2>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                                When should we start?
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-accent transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto hide-scrollbar p-6 space-y-6">

                        {/* Booking Type Selection */}
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-primary" /> Choose Booking Type
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {BOOKING_TYPES.map((type) => (
                                    <motion.button
                                        key={type.id}
                                        onClick={() => setTempBookingType(type.id)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`relative p-3 rounded-2xl text-center transition-all duration-300 border-2 ${tempBookingType === type.id
                                            ? `${type.borderColor} ${type.bgColor} shadow-lg`
                                            : "border-border glass hover:border-muted-foreground/30"
                                            }`}
                                    >
                                        {tempBookingType === type.id && (
                                            <motion.div
                                                layoutId="booking-indicator-modal"
                                                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center border-2 border-background`}
                                            >
                                                <Check className="w-3 h-3 text-white" />
                                            </motion.div>
                                        )}
                                        <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 ${tempBookingType === type.id
                                            ? `bg-gradient-to-r ${type.color}`
                                            : "bg-accent"
                                            }`}>
                                            <type.icon className={`w-5 h-5 ${tempBookingType === type.id ? "text-white" : "text-muted-foreground"}`} />
                                        </div>
                                        <p className={`text-[11px] font-bold ${tempBookingType === type.id ? type.textColor : ""}`}>
                                            {type.label}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-3 text-center italic">
                                {BOOKING_TYPES.find(t => t.id === tempBookingType)?.description}
                            </p>
                        </div>

                        {/* Conditional Views */}
                        <AnimatePresence mode="wait">
                            {tempBookingType === "instant" && (
                                <motion.div
                                    key="instant-view"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-amber-500/10 rounded-2xl p-5 border-2 border-amber-500/20 text-center"
                                >
                                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                                        <Zap className="w-6 h-6 text-amber-600 animate-pulse" />
                                    </div>
                                    <h4 className="font-bold text-sm text-amber-900">Priority Assignment</h4>
                                    <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                                        A professional will be dispatched immediately. Most services start within 45-60 minutes.
                                    </p>
                                </motion.div>
                            )}

                            {tempBookingType === "prebook" && (
                                <motion.div
                                    key="prebook-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="space-y-6"
                                >
                                    {/* Date Selection */}
                                    <div>
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Select Date
                                        </h3>
                                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                                            {dates.map((d) => (
                                                <button
                                                    key={d.key}
                                                    onClick={() => setTempDate(d.key)}
                                                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center text-xs transition-all duration-200 min-w-[70px] border-2 ${tempDate === d.key
                                                        ? "bg-gradient-to-b from-blue-500 to-cyan-500 text-white border-blue-400 shadow-lg scale-105"
                                                        : "glass border-border hover:border-blue-500/30"
                                                        }`}
                                                >
                                                    <div className="font-bold">{d.label}</div>
                                                    <div className="mt-1 text-[10px] opacity-80">{d.date}</div>
                                                    {d.isToday && (
                                                        <div className={`text-[8px] font-black mt-1 uppercase ${tempDate === d.key ? "text-white/90" : "text-blue-500"}`}>
                                                            Today
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div>
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-blue-500" /> Select Time Slot
                                        </h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setTempSlot(slot)}
                                                    className={`px-2 py-2.5 rounded-xl text-[10px] font-bold text-center border-2 transition-all duration-200 ${tempSlot === slot
                                                        ? "bg-gradient-to-b from-blue-500 to-cyan-500 text-white border-blue-400 shadow-md scale-105"
                                                        : "glass border-border hover:border-blue-500/30"
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {tempBookingType === "customized" && (
                                <motion.div
                                    key="customized-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Pick Date
                                            </h3>
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={tempDate || ""}
                                                onChange={(e) => setTempDate(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-accent text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-purple-500" /> Pick Time
                                            </h3>
                                            <input
                                                type="time"
                                                value={tempSlot || ""}
                                                onChange={(e) => setTempSlot(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-accent text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-border"
                                            />
                                        </div>
                                    </div>

                                    {/* Event Type & People */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <PartyPopper className="w-3.5 h-3.5 text-purple-500" /> Event Type
                                            </h3>
                                            <select
                                                value={eventType}
                                                onChange={(e) => setEventType(e.target.value)}
                                                className="w-full h-11 px-3 rounded-xl bg-accent text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-border appearance-none"
                                            >
                                                <option>Home Service</option>
                                                <option>Bridal Event</option>
                                                <option>Birthday Party</option>
                                                <option>Kitty Party</option>
                                                <option>Corporate Event</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-purple-500" /> No. of People
                                            </h3>
                                            <div className="flex bg-accent rounded-xl p-1 h-11 border border-border">
                                                {["1", "2-5", "5+"].map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setPeopleCount(opt)}
                                                        className={`flex-1 rounded-lg text-[10px] font-bold transition-all ${peopleCount === opt ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Settings2 className="w-3.5 h-3.5 text-purple-500" /> Special Requirements
                                        </h3>
                                        <textarea
                                            placeholder="Example: Need 2 professionals, specific brands, etc."
                                            rows={2}
                                            value={tempNotes}
                                            onChange={(e) => setTempNotes(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-accent text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none border border-border"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-6 bg-background border-t border-border">
                        <Button
                            onClick={handleSave}
                            disabled={tempBookingType !== "instant" && (!tempDate || !tempSlot)}
                            className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 bg-black text-white hover:bg-black/90 flex items-center justify-center space-x-2 border-none"
                        >
                            <span>CONFIRM & CONTINUE</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SlotSelectionModal;
