import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGenderTheme } from "@/modules/user/contexts/GenderThemeContext";
import { useBookings } from "@/modules/user/contexts/BookingContext";
import {
    ArrowLeft, Calendar, Clock, ChevronRight,
    MapPin, ShoppingBag, Star, RefreshCcw,
    MessageSquare, Phone
} from "lucide-react";
import ChatModal from "@/modules/user/components/salon/ChatModal";
import CallingOverlay from "@/modules/user/components/salon/CallingOverlay";
import SlotSelectionModal from "@/modules/user/components/salon/SlotSelectionModal";

const BookingsPage = () => {
    const navigate = useNavigate();
    const { gender } = useGenderTheme();
    const { bookings } = useBookings();
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [chatBooking, setChatBooking] = useState(null);
    const [callingBooking, setCallingBooking] = useState(null);
    const [rescheduleBooking, setRescheduleBooking] = useState(null);

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
            {/* Header */}
            <div className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className={`text-lg font-semibold ${gender === "women" ? "font-display" : "font-heading-men"}`}>My Bookings</h1>
            </div>

            <div className="px-4 md:px-8 lg:px-0 max-w-2xl mx-auto mt-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {["Upcoming", "Past"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "bg-accent text-muted-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {bookings
                        .filter(b => activeTab === "Upcoming" ? b.status === "Upcoming" : b.status !== "Upcoming")
                        .map((booking, i) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-strong rounded-2xl overflow-hidden border border-border/50 group"
                            >
                                <div className="p-4">
                                    <div className="flex gap-4">
                                        {/* Service Image */}
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={booking.image} alt={booking.serviceName} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-sm truncate">{booking.serviceName}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.status === "Upcoming"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {booking.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {booking.time}
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 text-primary" /> {booking.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Paid</p>
                                            <p className="font-bold text-primary">₹{booking.price}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {booking.status === "Upcoming" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setChatBooking(booking)}
                                                        className="h-9 w-9 rounded-xl border border-primary/20 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCallingBooking(booking)}
                                                        className="h-9 w-9 rounded-xl border border-primary/20 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setRescheduleBooking(booking)}
                                                        className="px-4 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold hover:bg-primary/10 transition-colors"
                                                    >
                                                        Reschedule
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold flex items-center gap-1.5 hover:bg-primary/10 transition-colors">
                                                        <Star className="w-3.5 h-3.5 fill-primary" /> Rate
                                                    </button>
                                                    <button className="px-4 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold flex items-center gap-1.5 hover:bg-primary/10 transition-colors">
                                                        <RefreshCcw className="w-3 h-3" /> Rebook
                                                    </button>
                                                </div>
                                            )}
                                            <button className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Empty State Mockup */}
                {bookings.filter(b => activeTab === "Upcoming" ? b.status === "Upcoming" : b.status !== "Upcoming").length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-lg font-bold mb-1">No Bookings Yet</h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            You haven't booked any services yet. Start exploring our premium salon services!
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="mt-6 px-8 py-2.5 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20"
                        >
                            Explore Services
                        </button>
                    </div>
                )}
            </div>

            {/* Modals & Overlays */}
            <ChatModal
                isOpen={!!chatBooking}
                onClose={() => setChatBooking(null)}
                booking={chatBooking}
            />

            <CallingOverlay
                isOpen={!!callingBooking}
                onClose={() => setCallingBooking(null)}
                booking={callingBooking}
            />

            <SlotSelectionModal
                isOpen={!!rescheduleBooking}
                onClose={() => setRescheduleBooking(null)}
                onSave={() => {
                    // Logic to update the booking with new slot could go here
                    alert("Booking Rescheduled Successfully!");
                    setRescheduleBooking(null);
                }}
            />
        </div>
    );
};

export default BookingsPage;

