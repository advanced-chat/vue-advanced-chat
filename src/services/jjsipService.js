// JJSIP Service
// This service assumes JJSIP library is loaded globally via a script tag.

// Check if JJSIP is loaded
if (typeof window.JJSIP === 'undefined') {
  console.error('JJSIP library not found. Make sure it is loaded globally.');
}

let ua;
let currentSession; // To keep track of the active call session

const defaultConfig = {
  sipUri: 'sip:user@example.com',
  password: 'password',
  wsServer: 'wss://sip.example.com',
  displayName: 'Web User',
};

const emitEvent = (eventName, data) => {
  console.log(`[JJSIP Event Emitted] ${eventName}:`, data || '');
};

const initJJsip = (config = {}) => {
  const settings = { ...defaultConfig, ...config };

  if (typeof window.JJSIP === 'undefined' || typeof window.JJSIP.UA === 'undefined') {
    console.error('Cannot initialize JJSIP: JJSIP.UA is not defined.');
    return null;
  }

  try {
    const configuration = {
      uri: settings.sipUri,
      password: settings.password,
      ws_servers: settings.wsServer,
      display_name: settings.displayName,
      register: true,
    };

    ua = new window.JJSIP.UA(configuration);
    console.log('JJSIP.UA instance created. Attempting to start...');

    ua.on('registered', (data) => {
      console.log('JJSIP Registered:', data);
      emitEvent('jjsip_registered');
    });

    ua.on('unregistered', (data) => {
      console.log('JJSIP Unregistered:', data);
      emitEvent('jjsip_unregistered');
    });

    ua.on('registrationFailed', (data) => {
      console.error('JJSIP Registration Failed:', data);
      emitEvent('jjsip_registration_failed', data);
    });

    ua.on('new_session', (sessionData) => { // JJSIP often passes { session, originator, request }
      const incomingSession = sessionData.session; // Assuming session object is directly in sessionData or sessionData.session
      console.log('JJSIP New Session (Incoming Call):', incomingSession);
      currentSession = incomingSession; // Keep track of this session
      emitEvent('jjsip_incoming_call', { session: incomingSession });

      incomingSession.on('accepted', () => {
        console.log('JJSIP Call Accepted (Incoming) - by remote after we answer locally.');
        // This 'accepted' means the call is fully established.
        emitEvent('jjsip_call_connected', { session: incomingSession, originator: 'remote' });
        // Audio setup is expected to be called by the UI component (Room.vue) using setRemoteAudioElement.
      });

      incomingSession.on('ended', () => {
        console.log('JJSIP Call Ended (Incoming)');
        emitEvent('jjsip_call_disconnected', { session: incomingSession, originator: 'remote' });
        if (currentSession === incomingSession) {
          currentSession = null;
        }
      });

      incomingSession.on('failed', (data) => {
        console.error('JJSIP Call Failed (Incoming):', data);
        emitEvent('jjsip_call_failed', { session: incomingSession, originator: 'remote', data });
        if (currentSession === incomingSession) {
          currentSession = null;
        }
      });
    });

    ua.start();
    console.log('JJSIP UA started.');

  } catch (error) {
    console.error('Error initializing JJSIP UA:', error);
    return null;
  }
  return ua;
};

const makeCall = (targetUri) => {
  if (!ua) {
    console.error('JJSIP UA not initialized. Cannot make call.');
    return null;
  }
  if (!targetUri) {
    console.error('Target URI is required to make a call.');
    return null;
  }

  console.log(`Attempting to make call to: ${targetUri}`);
  try {
    const session = ua.call(targetUri, {
      mediaConstraints: { audio: true, video: false },
    });

    if (!session) {
      console.error('Failed to create call session.');
      return null;
    }

    currentSession = session;
    console.log('JJSIP Outgoing Call Session Created:', session);
    emitEvent('jjsip_outgoing_call_initiated', { session, targetUri });

    session.on('connecting', () => {
      console.log('JJSIP Call Connecting (Outgoing)');
    });
    
    session.on('accepted', () => {
      console.log('JJSIP Call Accepted (Outgoing) - by remote. Audio setup by UI component via setRemoteAudioElement.');
      emitEvent('jjsip_call_connected', { session, originator: 'local' });
    });

    session.on('ended', () => {
      console.log('JJSIP Call Ended (Outgoing)');
      emitEvent('jjsip_call_disconnected', { session, originator: 'local' });
      if (currentSession === session) {
        currentSession = null;
      }
    });

    session.on('failed', (data) => {
      console.error('JJSIP Call Failed (Outgoing):', data);
      emitEvent('jjsip_call_failed', { session, originator: 'local', data });
      if (currentSession === session) {
        currentSession = null;
      }
    });
    return session;
  } catch (error) {
    console.error('Error making call:', error);
    emitEvent('jjsip_call_failed', { error, originator: 'local' });
    return null;
  }
};

const answerCall = (session) => {
  const callSession = session || currentSession;
  if (!callSession) {
    console.error('No active session to answer.');
    return;
  }
  if (typeof callSession.answer !== 'function') {
    console.error('Session object does not have an answer method.', callSession);
    return;
  }
  console.log('Attempting to answer call for session:', callSession);
  try {
    callSession.answer({
      mediaConstraints: { audio: true, video: false }
    });
    // JJSIP session's 'accepted' event will fire if successful.
    // UI component (Room.vue) will then call setRemoteAudioElement.
  } catch (error) {
    console.error('Error answering call:', error);
  }
};

const hangupCall = (session) => {
  const callSession = session || currentSession;
  if (!callSession || typeof callSession.terminate !== 'function') {
    console.error('No active session or terminate method missing.');
    return;
  }
  console.log('Attempting to hang up call for session:', callSession);
  callSession.terminate();
};

const muteCall = (session) => {
  const callSession = session || currentSession;
  if (!callSession || typeof callSession.mute !== 'function') {
    // console.warn('No active session or mute method missing.'); // Less noisy
    return;
  }
  callSession.mute({ audio: true });
};

const unmuteCall = (session) => {
  const callSession = session || currentSession;
  if (!callSession || typeof callSession.unmute !== 'function') {
    // console.warn('No active session or unmute method missing.'); // Less noisy
    return;
  }
  callSession.unmute({ audio: true });
};

const setRemoteAudioElement = (session, audioElement) => {
  if (!session) {
    console.error('[jjsipService] setRemoteAudioElement: session is null.');
    return;
  }
  if (!audioElement) {
    console.error('[jjsipService] setRemoteAudioElement: audioElement is null.');
    return;
  }
  console.log('[jjsipService] Attempting to set remote audio element for session:', session.id);

  if (session._remoteAudioSetupAttempted) {
    console.log('[jjsipService] Remote audio setup already attempted for session:', session.id);
    if (!audioElement.srcObject && session._lastKnownRemoteStream) {
        console.log('[jjsipService] Re-attaching known stream to audio element.');
        audioElement.srcObject = session._lastKnownRemoteStream;
        audioElement.play().catch(e => console.error("[jjsipService] Error re-playing audio:", e));
    }
    return;
  }

  let trackListenerAttached = false;
  const pc = session.connection || (session.mediaHandler ? session.mediaHandler.peerConnection : null);

  if (pc && typeof pc.ontrack === 'function') {
    pc.ontrack = (event) => {
      console.log('[jjsipService] RTCPeerConnection "ontrack" event for session:', session.id, event);
      if (event.streams && event.streams[0]) {
        audioElement.srcObject = event.streams[0];
        session._lastKnownRemoteStream = event.streams[0];
      } else if (event.track) {
        const newStream = new MediaStream([event.track]);
        audioElement.srcObject = newStream;
        session._lastKnownRemoteStream = newStream;
      }
      if (audioElement.srcObject) {
        audioElement.play().catch(e => console.error("[jjsipService] Error playing audio (ontrack):", e));
      }
    };
    trackListenerAttached = true;
    console.log('[jjsipService] RTCPeerConnection "ontrack" handler set up for session:', session.id);
  } else if (typeof session.on === 'function' && !pc) { // If no direct pc access, rely on session events
     session.on('track', (eventData) => {
      console.log('[jjsipService] Session "track" event for session:', session.id, eventData);
      const stream = eventData.streams ? eventData.streams[0] : null;
      const track = eventData.track;
      if (stream) {
        audioElement.srcObject = stream;
        session._lastKnownRemoteStream = stream;
      } else if (track) {
        const newStream = new MediaStream([track]);
        audioElement.srcObject = newStream;
        session._lastKnownRemoteStream = newStream;
      }
      if (audioElement.srcObject) {
        audioElement.play().catch(e => console.error("[jjsipService] Error playing audio (session 'track' event):", e));
      }
      trackListenerAttached = true;
    });
    console.log('[jjsipService] Session "track" event listener configured for session:', session.id);
  }
  
  if (session.remote_stream) { 
    console.log('[jjsipService] Using pre-existing session.remote_stream.');
    audioElement.srcObject = session.remote_stream;
    session._lastKnownRemoteStream = session.remote_stream;
    audioElement.play().catch(e => console.error("[jjsipService] Error playing audio (session.remote_stream):", e));
    trackListenerAttached = true;
  }

  if (!trackListenerAttached) {
    console.warn('[jjsipService] Could not determine how to attach remote audio for JJSIP session. Audio may not play.');
  }
  session._remoteAudioSetupAttempted = true;
};

export {
  initJJsip,
  makeCall,
  answerCall,
  hangupCall,
  muteCall,
  unmuteCall,
  setRemoteAudioElement,
};
