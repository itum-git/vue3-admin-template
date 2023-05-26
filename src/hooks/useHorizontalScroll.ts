/**
 * 横向滚动条
 */
class horizontalScroll {
    private el: HTMLElement
    private wheelEvent: string

    constructor(element:  HTMLElement) {
        this.el = element
        this.wheelEvent = ''
        this.mount()
    }

    mount() {
        this.wheelEvent = this.getEventName()
        this.el['addEventListener'](this.wheelEvent, this.scroll, { passive: true })
    }

    getEventName() {
        let wheel = ''

        if ('onmousewheel' in this.el) {
            wheel = 'mousewheel'
        } else if ('onwheel' in this.el) {
            wheel = 'wheel'
        } else if ('attachEvent' in window) {
            wheel = 'onmousewheel'
        } else {
            wheel = 'DOMMouseScroll'
        }
        return wheel
    }

    scroll = (event: any) => {
        if (this.el.clientWidth >= this.el.scrollWidth) {
            return
        }
        this.el.scrollLeft += event.deltaY ? event.deltaY : event.detail && event.detail !== 0 ? event.detail : -event.wheelDelta
    }
}

export const useHorizontalScroll = (element:  HTMLElement) =>  {
    return new horizontalScroll(element)
}
