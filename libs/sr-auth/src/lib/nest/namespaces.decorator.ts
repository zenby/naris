import { SetMetadata } from '@nestjs/common';
import { ManifestNamespace } from '@soer/sr-common-interfaces';

export const NamespacesForViewerRole = (...namespaces: ManifestNamespace[]) => SetMetadata('namespaces', namespaces);
