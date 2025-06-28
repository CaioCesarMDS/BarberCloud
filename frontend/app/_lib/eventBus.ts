import mitt from 'mitt'

type Events = {
  profileUpdated: void
}

export const eventBus = mitt<Events>()
