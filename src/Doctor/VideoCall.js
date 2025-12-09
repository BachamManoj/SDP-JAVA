import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import api from "../api/apiClient";
import { useLocation } from "react-router-dom";

function randomID(len = 5) {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function VideoCall() {
  const location = useLocation();
  const [containerRef, setContainerRef] = useState(null);

  const roomID =
    new URLSearchParams(window.location.search).get("roomID") || randomID(5);

  const appointmentID =
    location?.state?.appointmentID ||
    new URLSearchParams(window.location.search).get("appointmentID");

  useEffect(() => {
    if (!containerRef) return;

    const appID = 740050980;
    const serverSecret = "43894ba0c99ad5a8e0ffab01661b63a7";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(),
      randomID()
    );

    const videoCallUrl = `${window.location.origin}${window.location.pathname}?roomID=${roomID}&appointmentID=${appointmentID}`;

    if (appointmentID) {
      api.put("/OnlineConferance", null, {
        params: { url: videoCallUrl, appointmentId: appointmentID }
      });
    }

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef,
      sharedLinks: [{ name: "Call Link", url: videoCallUrl }],
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall }
    });
  }, [containerRef, appointmentID, roomID]);

  return <div ref={setContainerRef} style={{ width: "100%", height: "130vh" }}></div>;
}
