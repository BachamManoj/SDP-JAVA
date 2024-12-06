import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Importing useLocation for accessing passed state

function randomID(len) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const location = useLocation(); // Using useLocation to get passed state
  const [containerRef, setContainerRef] = React.useState(null); // State to store ref of the container

  const roomID = getUrlParams().get('roomID') || randomID(5);
  const appointmentID = location?.state?.appointmentID || getUrlParams().get('appointmentID'); // Access appointmentID from passed state or URL

  React.useEffect(() => {
    if (containerRef) {
      const appID = 740050980;
      const serverSecret = '43894ba0c99ad5a8e0ffab01661b63a7';
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(5),
        randomID(5)
      );

      // Generate video call URL
      const videoCallUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

      // Send the generated video call URL to the backend (only if appointmentID exists)
      if (appointmentID) {
        axios.put('http://localhost:9999/OnlineConferance', null, {
          params: { url: videoCallUrl, appointmentid: appointmentID },
        })
        .then(() => console.log('Video call URL updated successfully'))
        .catch((error) => console.error('Failed to update video call URL', error));
      }

      // Start the video call with Zego
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef,
        sharedLinks: [
          {
            name: 'Personal link',
            url: videoCallUrl,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    }
  }, [containerRef, appointmentID]); // Dependency array to run this effect when component mounts or appointmentID changes

  return (
    <div
      ref={setContainerRef} 
      style={{ width: '100%', height: '130vh' }}
    ></div>
  );
}
