import { mount } from '@vue/test-utils';
import Room from '@/lib/Room/Room.vue'; // Adjust path as necessary
import * as jjsipService from '@/services/jjsipService';

// Mock the jjsipService
jest.mock('@/services/jjsipService', () => ({
  initJJsip: jest.fn(),
  makeCall: jest.fn(),
  answerCall: jest.fn(),
  hangupCall: jest.fn(),
  setRemoteAudioElement: jest.fn(),
}));

// Mock child components that might be heavy or have their own dependencies
jest.mock('@/lib/Room/RoomHeader/RoomHeader.vue', () => ({
  name: 'RoomHeader',
  template: '<div class="mock-room-header"></div>',
  props: [], // Add any props Room.vue expects to pass to RoomHeader if needed for rendering logic
  emits: ['start-call'] // Ensure it can emit start-call if testing that interaction
}));
jest.mock('@/lib/Room/RoomFooter/RoomFooter.vue', () => ({
  name: 'RoomFooter',
  template: '<div class="mock-room-footer"></div>',
  props: [],
}));
jest.mock('@/lib/Room/RoomMessage/RoomMessage.vue', () => ({
  name: 'RoomMessage',
  template: '<div class="mock-room-message"></div>',
  props: ['message'], // Mock necessary props
}));
jest.mock('@/components/Loader/Loader.vue', () => ({
  name: 'Loader',
  template: '<div class="mock-loader"></div>',
  props: ['show']
}));
jest.mock('@/components/SvgIcon/SvgIcon.vue', () => ({
  name: 'SvgIcon',
  template: '<div class="mock-svg-icon"></div>',
  props: ['name', 'param']
}));


describe('Room.vue JJSIP Integration', () => {
  let wrapper;
  const mockRoomId = 'room123';
  const mockUserId = 'user123';

  const defaultProps = {
    currentUserId: mockUserId,
    textMessages: {}, // Add essential text messages if needed for rendering
    singleRoom: false,
    showRoomsList: false,
    isMobile: false,
    rooms: [{ roomId: mockRoomId, users: [{ _id: mockUserId, username: 'Test User' }] }],
    roomId: mockRoomId,
    loadFirstRoom: true,
    messages: [],
    messagesLoaded: true,
    menuActions: [],
    messageActions: [],
    messageSelectionActions: [],
    autoScroll: { send: {}, receive: {} },
    showSendIcon: true,
    showFiles: true,
    showAudio: true,
    audioBitRate: 128,
    audioSampleRate: 44100,
    showEmojis: true,
    showReactionEmojis: true,
    showNewMessagesDivider: true,
    showFooter: true,
    acceptedFiles: '*',
    captureFiles: '',
    textFormatting: {},
    linkOptions: {},
    roomInfoEnabled: false,
    textareaActionEnabled: false,
    textareaAutoFocus: false,
    userTagsEnabled: false,
    emojisSuggestionEnabled: false,
    scrollDistance: 60,
    usernameOptions: {},
    // JJSIP Props
    jjsipSipUri: 'sip:test@props.com',
    jjsipPassword: 'propPassword',
    jjsipWebSocketServer: 'wss://props.example.com',
    jjsipDisplayName: 'Props User',
  };

  const mockUaInstance = {
    on: jest.fn(),
    start: jest.fn(),
  };
  
  const mockSession = { 
    id: 'mockSession123', 
    on: jest.fn(), 
    answer: jest.fn(), 
    terminate: jest.fn(),
    remote_identity: { uri: { toString: () => 'sip:remote@example.com' } }
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
    jjsipService.initJJsip.mockReturnValue(mockUaInstance); // Mock initJJsip to return a mock UA
    jjsipService.makeCall.mockReturnValue(mockSession); // Mock makeCall to return a mock session
    
    wrapper = mount(Room, {
      props: defaultProps,
      global: {
        stubs: { // Stubbing child components
          'room-header': true, // Basic stub
          'room-footer': true,
          'room-message': true,
          'loader': true,
          'svg-icon': true,
        }
      }
    });
  });

  it('initializes JJSIP with credentials from props on mount', () => {
    expect(jjsipService.initJJsip).toHaveBeenCalledTimes(1);
    expect(jjsipService.initJJsip).toHaveBeenCalledWith({
      sipUri: defaultProps.jjsipSipUri,
      password: defaultProps.jjsipPassword,
      wsServer: defaultProps.jjsipWebSocketServer,
      displayName: defaultProps.jjsipDisplayName,
    });
    expect(mockUaInstance.on).toHaveBeenCalledWith('new_session', expect.any(Function));
    expect(mockUaInstance.on).toHaveBeenCalledWith('registered', expect.any(Function));
    // ... other event handlers
  });

  it('calls jjsipService.makeCall when startCall method is invoked', async () => {
    await wrapper.vm.startCall(); // Directly call the method
    expect(jjsipService.makeCall).toHaveBeenCalledTimes(1);
    // You can add more specific assertions about the arguments if needed
    expect(jjsipService.makeCall).toHaveBeenCalledWith(expect.stringContaining('sip:')); // Basic check
  });

  describe('Incoming Call UI', () => {
    const incomingSessionData = { 
      session: { 
        ...mockSession, 
        id: 'incomingSessionId',
        remote_identity: { uri: { toString: () => 'sip:caller@example.com' } }
      } 
    };

    beforeEach(async () => {
      await wrapper.setData({
        isIncomingCall: true,
        incomingCallData: incomingSessionData,
      });
    });

    it('renders incoming call notification when isIncomingCall is true', () => {
      expect(wrapper.text()).toContain('Incoming call from: sip:caller@example.com');
      expect(wrapper.find('button.mock-answer-button').exists()).toBe(false); // Using text for now
      const buttons = wrapper.findAll('button');
      const answerButton = buttons.find(b => b.text() === 'Answer');
      const declineButton = buttons.find(b => b.text() === 'Decline');
      expect(answerButton.exists()).toBe(true);
      expect(declineButton.exists()).toBe(true);
    });

    it('calls jjsipService.answerCall when Answer button is clicked', async () => {
      const buttons = wrapper.findAll('button');
      const answerButton = buttons.find(b => b.text() === 'Answer');
      await answerButton.trigger('click');
      expect(jjsipService.answerCall).toHaveBeenCalledWith(incomingSessionData.session);
    });

    it('calls jjsipService.hangupCall when Decline button is clicked', async () => {
      const buttons = wrapper.findAll('button');
      const declineButton = buttons.find(b => b.text() === 'Decline');
      await declineButton.trigger('click');
      expect(jjsipService.hangupCall).toHaveBeenCalledWith(incomingSessionData.session);
    });
  });

  describe('Active Call UI', () => {
    const activeSessionData = { 
        ...mockSession,
        id: 'activeSessionId',
        remote_identity: { uri: { toString: () => 'sip:activecallee@example.com' } }
    };

    beforeEach(async () => {
      await wrapper.setData({
        isCallActive: true,
        jjsip_currentSession: activeSessionData,
        isIncomingCall: false, // Ensure incoming call UI is hidden
      });
    });

    it('renders active call UI when isCallActive is true', () => {
      expect(wrapper.text()).toContain('Call in progress with: sip:activecallee@example.com');
      const hangUpButton = wrapper.findAll('button').find(b => b.text() === 'Hang Up');
      expect(hangUpButton.exists()).toBe(true);
    });

    it('calls jjsipService.hangupCall when Hang Up button is clicked', async () => {
      const hangUpButton = wrapper.findAll('button').find(b => b.text() === 'Hang Up');
      await hangUpButton.trigger('click');
      expect(jjsipService.hangupCall).toHaveBeenCalledWith(activeSessionData);
    });
  });

  it('contains an audio element with ref "jjsipAudioElement"', () => {
    const audioElement = wrapper.find('audio[ref="jjsipAudioElement"]');
    expect(audioElement.exists()).toBe(true);
  });

  it('calls setRemoteAudioElement when an outgoing call is accepted', async () => {
    await wrapper.vm.startCall(); // This sets up mockSessionInstance with its 'on' mock
    
    // Find the 'accepted' event registration on the mockSessionInstance
    const acceptedCallbackRegistration = mockSession.on.mock.calls.find(call => call[0] === 'accepted');
    expect(acceptedCallbackRegistration).toBeDefined();
    const onAcceptedCallback = acceptedCallbackRegistration[1];
    
    onAcceptedCallback(); // Manually trigger the 'accepted' callback

    expect(jjsipService.setRemoteAudioElement).toHaveBeenCalledTimes(1);
    expect(jjsipService.setRemoteAudioElement).toHaveBeenCalledWith(mockSession, wrapper.vm.$refs.jjsipAudioElement);
  });

  it('calls setRemoteAudioElement when an incoming call is answered and accepted', async () => {
    const incomingSession = { ...mockSession, id: 'incomingTestSession', on: jest.fn() };
    // Simulate incoming call via handleIncomingCall which is triggered by UA event
    wrapper.vm.handleIncomingCall({ session: incomingSession });
    await wrapper.vm.$nextTick(); // Wait for data changes

    // Simulate clicking "Answer"
    await wrapper.vm.answerIncomingCall();

    // Find the 'accepted' event registration on the incomingSession
    const acceptedCallbackRegistration = incomingSession.on.mock.calls.find(call => call[0] === 'accepted');
    expect(acceptedCallbackRegistration).toBeDefined();
    const onAcceptedCallback = acceptedCallbackRegistration[1];

    onAcceptedCallback(); // Manually trigger the 'accepted' callback for the incoming session

    expect(jjsipService.setRemoteAudioElement).toHaveBeenCalledTimes(1);
    expect(jjsipService.setRemoteAudioElement).toHaveBeenCalledWith(incomingSession, wrapper.vm.$refs.jjsipAudioElement);
  });
});
