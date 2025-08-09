import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCClient, IRemoteAudioTrack, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

// A custom hook to simplify Agora logic could be created here: useAgora.ts

interface VoiceRoomProps {
  roomId: Id<"voiceChatRooms">;
  onLeave: () => void;
}

const appId = import.meta.env.VITE_AGORA_APP_ID; // Using Vite env variables

export function VoiceRoom({ roomId, onLeave }: VoiceRoomProps) {
  const generateToken = useMutation(api.agora.generateAgoraToken);
  const [token, setToken] = useState<string | null>(null);
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const result = await generateToken({ roomId });
        setToken(result);
      } catch (error) {
        console.error("Failed to get token", error);
        // Handle error (e.g., show toast, leave room)
      }
    };
    fetchToken();
  }, [roomId, generateToken]);

  useEffect(() => {
    if (!token) return;

    const joinChannel = async () => {
      try {
        await client.join(appId, roomId, token, null);
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
        await client.publish([audioTrack]);
      } catch (error) {
        console.error("Failed to join channel", error);
      }
    };

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
      setRemoteUsers(client.remoteUsers);
    });

    client.on("user-unpublished", (user) => {
      setRemoteUsers(client.remoteUsers);
    });

    client.on("user-left", (user) => {
      setRemoteUsers(client.remoteUsers);
    });

    joinChannel();

    return () => {
      localAudioTrack?.close();
      client.leave();
    };
  }, [token, client, roomId, localAudioTrack]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Room Active</h2>
        <button onClick={onLeave} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
          Leave Room
        </button>
      </div>
      
      {/* In-Room UI will go here */}
      <div className="text-white">
        <h3 className="font-bold mb-2">Participants</h3>
        <div>
            <p>You (local)</p>
        </div>
        {remoteUsers.map(user => <div key={user.uid}>Remote User: {user.uid}</div>)}
      </div>
    </div>
  );
}
