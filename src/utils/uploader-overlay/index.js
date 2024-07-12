import { translate } from '../i18n'

window.Optidata = window.Optidata || {}

export default class FileUploaderOverlay {
  constructor() {
    this.init = () => {
      this.initEventListeners()
    }

    this.initEventListeners = () => {
      document.body.addEventListener('drop', this.onDrop.bind(this))
      document.body.addEventListener('dragenter', this.onDrag.bind(this))
      document.body.addEventListener('dragleave', this.onDrag.bind(this))
    }

    this.onDrop = async event => {
      event.preventDefault()
      event.stopPropagation()
      this.removeDragOverlay()
    }

    this.onDrag = event => {
      event.preventDefault()

      switch (event.type) {
      case 'dragenter':
        this.addDragOverlay()
        break
      case 'dragleave':
        this.removeDragOverlay()
        break

      default:
        break
      }
    }

    this.addDragOverlay = () => {
      if ($('#vac-overlay').length !== 0) {
        return
      }

      $('#chat').prepend(`
        <div id='vac-overlay'>
        <div class='vac-drag-overlay'>
            <div class="vac-drag-overlay-border"></div>
            <div class='vac-drag-overlay-indicator'>
              <i class="bi bi-upload"></i>
              <span class='vac-drag-overlay-title'>${translate('Drop the file here to send')}</span>

              <div>
                <span>${translate('Tip: you can drop multiple files at once')}</span>
              </div>
            </div>
          </div>
        </div>
      `)

      this.calculatePosition()
    }

    this.removeDragOverlay = () => {
      if ($('#vac-overlay').length === 0) {
        return
      }

      $('#vac-overlay').remove()
    }

    this.calculatePosition = () => {
      const overlay = $('.vac-drag-overlay')
      const overlayNewX = $('div[slot="rooms-header"]').width() + 'px'
      const overlayNewWidth = `calc(100vw - ${overlayNewX})`

      overlay.css({ left: overlayNewX, width: overlayNewWidth })
    }
  }
}

window.Optidata.FileUploaderOverlay = new FileUploaderOverlay()
