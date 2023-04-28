import { TestBed } from '@angular/core/testing';
import { Observable, Subscriber } from 'rxjs';
import { PersonalActivityRaw, PersonalActivityService } from '../../api/progress/personal-activity.service';
import { VideoModel } from '../../api/streams/stream.model';
import { StreamService } from '../../api/streams/stream.service';
import { WorkshopsService } from '../../api/workshops/workshops.service';
import { VideoService } from './video.service';
import { faker } from '@faker-js/faker';

describe('VideoService', () => {
  let sut: VideoService | null = null;

  const configureService = (
    streams: VideoModel = [] as unknown as VideoModel,
    workshops: VideoModel = [] as unknown as VideoModel,
    personalActivity: PersonalActivityRaw[] = []
  ) => {
    const streamService = {
      getStreams: () =>
        new Observable<VideoModel>((subscriber: Subscriber<VideoModel>) => {
          subscriber.next([streams] as unknown as VideoModel);
        }),
    };
    const workshopsService = {
      getWorkshops: () =>
        new Observable<VideoModel>((subscriber: Subscriber<VideoModel>) => {
          subscriber.next([workshops] as unknown as VideoModel);
        }),
    };
    const personalActivityService = {
      activityRaw$: new Observable<PersonalActivityRaw[]>((subscriber: Subscriber<PersonalActivityRaw[]>) =>
        subscriber.next(personalActivity)
      ),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StreamService,
          useValue: streamService,
        },
        {
          provide: WorkshopsService,
          useValue: workshopsService,
        },
        {
          provide: PersonalActivityService,
          useValue: personalActivityService,
        },
      ],
    });
    sut = TestBed.inject(VideoService);
  };

  describe('getAllVideos', () => {
    it('should return all videos', (done) => {
      const streams = createVideoModel(2);
      const workshops = createVideoModel(2);
      configureService(streams, workshops);

      let result = [];
      sut?.getAllVideos().subscribe((videos) => {
        result = videos;
        done();
      });

      expect(result.length).toBe(4);
    });
  });

  describe('getWathcedVideosByDate', () => {
    it('should return wathced videos', (done) => {
      const streams = createVideoModel(2);
      const workshops = createVideoModel(2);
      const today = new Date().toISOString();
      const activity = createWathedVideoActivity(streams.children ?? [], { createdAt: today });
      configureService(streams, workshops, activity);

      let result = {};
      sut?.getWathcedVideosByDate().subscribe((videos) => {
        result = videos;
        done();
      });

      expect(result).toStrictEqual({
        [today.slice(0, 10)]: streams.children?.map((video) => ({
          id: video.youtube_id,
          title: video.title,
        })),
      });
    });
  });
});

function createWathedVideoActivity(videos: VideoModel | VideoModel[], params: object = {}): PersonalActivityRaw[] {
  return (Array.isArray(videos) ? videos : [videos]).map(
    (video) =>
      ({
        id: faker.datatype.number(),
        watched: { videos: [{ videoId: video.youtube_id }] },
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
        ...params,
      } as unknown as PersonalActivityRaw)
  );
}

function createVideoModel(childrenCount = 3): VideoModel {
  return childrenCount
    ? ({
        title: faker.random.words(2),
        children: faker.datatype.array(childrenCount).map((el) => createVideoModel(0)),
      } as unknown as VideoModel)
    : ({
        youtube_id: faker.helpers.unique(faker.random.word),
        thumb_url: '',
        title: faker.random.words(3),
        desc: faker.random.words(4),
        tags: ['public'],
        createdAt: faker.datatype.datetime(),
      } as unknown as VideoModel);
}
