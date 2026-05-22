import EventCard from "@/components/EventCard";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { connection } from "next/server";

const HomeEventList = async () => {
    await connection(); 
    await connectDB();

    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    return (
        <ul className="events">
            {events && events.length > 0 ? (
                events.map((event) => (
                    <li key={event.title} className="list-none">
                        <EventCard {...event} />
                    </li>
                ))
            ) : (
                <p className="no-result">No events found</p>
            )}
        </ul>
    );
};

export default HomeEventList;
