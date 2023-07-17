import { ManifestModuleOptions } from '@soer/sr-auth-nest';

export const ManifestOptions: ManifestModuleOptions = {
  apiUrl: process.env.MANIFEST_API || '',
};
