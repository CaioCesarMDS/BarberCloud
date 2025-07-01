import mitt from 'mitt';

type Events = {
  profileUpdated: void;
}

export default mitt<Events>();
