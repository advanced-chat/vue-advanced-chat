<template>
  <div class="vac-rooms-filter-container">
    <div
      v-for="option in filteredRoomFilters"
      :key="option.name"
      class="vac-filter-option"
      :class="{ 'vac-filter-selected': isActive(option.name) }"
      @click.prevent.stop="setFilter(option.name)"
    >
      <span class="vac-filter-option-name" v-html="translate(option.label)" />
    </div>
  </div>
</template>

<script>

import { translate } from '../../../utils/i18n'

export default {
  name: 'RoomsFilter',

  components: { },

  props: {
    roomFilterSelected: { type: String, required: true },
    roomFilters: { type: Object, default: () => {} }
  },

  emits: [
    'set-filter-selected'
  ],

  data() { },

  computed: {
    filteredRoomFilters() {
      const filtered = {}
      Object.keys(this.roomFilters).map(f => {
        if (!this.roomFilters[f].label?.length) {
          return
        }
        filtered[f] = this.roomFilters[f]
      })
      return filtered
    }
  },

  watch: { },

  mounted() { },

  methods: {
    isActive(option) {
      return option === this.roomFilterSelected
    },
    setFilter(option) {
      if (this.roomFilterSelected === this.roomFilters.DEFAULT.name && option === this.roomFilters.DEFAULT.name) {
        return
      }

      if (this.roomFilterSelected === option) {
        this.$emit('set-filter-selected', this.roomFilters.DEFAULT.name)
        return
      }

      this.$emit('set-filter-selected', option)
    },
    translate(str) {
      return translate(str)
    }
  }
}
</script>
