import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  // eslint-disable-next-line react/prop-types
  const { userRef } = listing;

  useEffect(() => {
    const getlandlord = async () => {
      try {
        const res = await fetch(`/api/user/${userRef}`);
        const data = await res.json();

        setLandLord(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    getlandlord();
  }, [userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span>{landlord.username}</span> for
            {/* eslint-disable-next-line react/prop-types */}
            <span> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            placeholder="Enter your message"
            className="w-full border p-3 rounded-lg"
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            // eslint-disable-next-line react/prop-types
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
