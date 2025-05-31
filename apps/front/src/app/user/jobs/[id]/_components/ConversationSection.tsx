// user/job/[id]/_components/ConversationSection.tsx
import React from "react";

interface ConversationSectionProps {
  conversations: any[]; // Define a more specific type if conversations have a structure
}

const ConversationSection: React.FC<ConversationSectionProps> = ({
  conversations,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">My Conversations</h2>
      {conversations.length === 0 ? (
        <div className="text-gray-600">
          You haven&apos;t started any conversations with craftsmen yet.
        </div>
      ) : (
        // Render conversation list here if conversations exist
        <div>
          {/* Example:
          {conversations.map((conv) => (
            <div key={conv.id} className="border-b pb-2 mb-2">
              <p>{conv.title}</p>
            </div>
          ))}
          */}
          <p>Display conversations here...</p>
        </div>
      )}
    </div>
  );
};

export default ConversationSection;
