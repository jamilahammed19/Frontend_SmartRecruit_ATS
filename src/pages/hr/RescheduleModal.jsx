import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function RescheduleModal({ interview, onClose, onSubmit }) {
  const [newTime, setNewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState(interview?.meeting_link || "");
  const [location, setLocation] = useState(interview?.location || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingRequest = interview?.reschedule_requests?.find(
    (req) => req.status === "pending",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(interview.id, {
        scheduled_time: new Date(newTime).toISOString(),
        meeting_link: meetingLink || null,
        location: location || null,
      });
      onClose();
    } catch (error) {
      alert(
        "Failed to reschedule: " +
          (error.response?.data?.detail || error.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!interview) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-amber-50">
          <h2 className="text-xl font-bold text-amber-900">
            Reschedule: {interview.candidate_name}
          </h2>
          <p className="text-sm text-amber-700 mt-1">
            Set a new date and time for this interview.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {pendingRequest && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Candidate's Reason for Request:
              </p>
              <p className="text-sm text-slate-800 mt-1 italic">
                "{pendingRequest.reason}"
              </p>
              <p className="text-xs font-bold text-indigo-600 mt-2">
                Candidate requested roughly:{" "}
                {new Date(pendingRequest.requested_time).toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                New Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <Input
              label="Meeting Link (Online)"
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/..."
            />

            <Input
              label="Location (In-Person)"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Floor 4, Meeting Room B"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSubmitting || !newTime}
              className="!w-auto px-6"
            >
              {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
