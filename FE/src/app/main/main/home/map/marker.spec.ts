import { EMarkerType } from '../interfaces/marker-type.enum';
import { Marker } from './marker';

describe('Icon', () => {
  let marker: Marker;

  beforeEach(async () => {
    marker = new Marker(
      [0, 0],
      EMarkerType.EVENT,
      { location: { nativeElement: {} } } as any,
      {
        text: '',
        loadingProfileImage: false,
        profileImage: '',
        src: '',
      }
    );
  });

  it('should create an instance', () => {
    expect(marker).toBeTruthy();
  });
});
