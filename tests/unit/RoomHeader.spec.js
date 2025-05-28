import { shallowMount } from '@vue/test-utils';
import RoomHeader from '@/lib/Room/RoomHeader/RoomHeader.vue'; // Adjust path as necessary
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'; // Mock or provide this if not globally stubbed

// Mock SvgIcon component to prevent issues with it loading an SVG
jest.mock('@/components/SvgIcon/SvgIcon.vue', () => ({
  name: 'SvgIcon',
  template: '<div class="mock-svg-icon"></div>',
  props: ['name', 'param']
}));


describe('RoomHeader.vue', () => {
  let wrapper;

  const defaultProps = {
    currentUserId: 'user1',
    textMessages: { CANCEL_SELECT_MESSAGE: 'Cancel' }, // Add other required textMessages
    singleRoom: false,
    showRoomsList: true,
    isMobile: false,
    roomInfoEnabled: true,
    menuActions: [{ name: 'action1', title: 'Action 1' }],
    room: { roomId: 'room123', roomName: 'Test Room', users: [] },
    messageSelectionEnabled: false,
    messageSelectionActions: [],
    selectedMessagesTotal: 0,
  };

  beforeEach(() => {
    wrapper = shallowMount(RoomHeader, {
      props: defaultProps,
      global: {
        // If SvgIcon is globally registered, this might not be needed here,
        // but if it's imported locally in RoomHeader, the mock above should work.
        // Alternatively, provide a stub for SvgIcon if the mock doesn't cover it.
        stubs: {
         'svg-icon': SvgIcon // Using the imported mock
        }
      }
    });
  });

  it('renders the call button when room.roomId is present', () => {
    // RoomId is present in defaultProps
    const callButton = wrapper.find('.vac-phone-button');
    expect(callButton.exists()).toBe(true);
    expect(callButton.text()).toBe('Call'); // Assuming text "Call"
  });

  it('does not render the call button if room.roomId is not present', async () => {
    await wrapper.setProps({ room: { roomId: '', roomName: 'No Room', users: [] } });
    const callButton = wrapper.find('.vac-phone-button');
    // The button itself is wrapped in <slot v-if="room.roomId" name="room-options">
    // And the button itself also has v-if="room.roomId"
    // So, if the slot condition is false, the button won't be there.
    // This also depends on menuActions.length for the parent slot.
    // Let's re-evaluate the structure: the button is inside the slot.
    // For simplicity, we ensure menuActions is present.
    // The direct v-if on the button is what we test.
    expect(callButton.exists()).toBe(false);
  });
  
  it('emits "start-call" event when the call button is clicked', async () => {
    const callButton = wrapper.find('.vac-phone-button');
    expect(callButton.exists()).toBe(true); // Ensure button exists first
    
    await callButton.trigger('click');
    expect(wrapper.emitted('start-call')).toBeTruthy();
    expect(wrapper.emitted('start-call').length).toBe(1);
  });

  // Test for menu options visibility (as call button is next to it)
  it('shows menu icon when menuActions are present', () => {
    const menuIcon = wrapper.find('.vac-room-options');
    expect(menuIcon.exists()).toBe(true);
  });

  it('does not show menu icon when menuActions are empty', async () => {
    await wrapper.setProps({ menuActions: [] });
    const menuIcon = wrapper.find('.vac-room-options');
    expect(menuIcon.exists()).toBe(false);
  });
});
