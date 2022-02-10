
import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/shared/constants/common.constants';

const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
    cloud_name: 'dvwiadu8c',
      api_key: '332742462573547',
      api_secret: 'N3M1iTv5uD365DP05bTWcDBidaU',
    });
  },
};

export { CloudinaryProvider as Cloudinary}