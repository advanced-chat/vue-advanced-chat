import { shallowMount } from '@vue/test-utils'
import RoomsList from '../../src/lib/RoomsList/RoomsList'

import mockData from './mock-data'

let wrapper

beforeEach(() => {
	wrapper = shallowMount(RoomsList, {
		propsData: {
			currentUserId: mockData.currentUserId,
			textMessages: mockData.textMessages,
			showRoomsList: true,
			showAddRoom: mockData.showAddRoom,
			showSearch: mockData.showSearch,
			textFormatting: mockData.textFormatting,
			isMobile: false,
			rooms: mockData.rooms,
			loadingRooms: mockData.loadingRooms,
			roomsLoaded: mockData.roomsLoaded,
			room: mockData.rooms[0],
			roomActions: mockData.roomActions,
			linkOptions: mockData.linkOptions,
			scrollDistance: 60
		}
	})
})

afterEach(() => {
	wrapper.destroy()
})

describe('RoomsList', () => {
	test('is a Vue instance', () => {
		expect(wrapper.isVueInstance).toBeTruthy()
	})
})
