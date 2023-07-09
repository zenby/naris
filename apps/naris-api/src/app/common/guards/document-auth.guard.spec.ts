import { Test } from '@nestjs/testing';
import { DocumentAuthGuard } from './document-auth.guard';
import { JsonService } from '../../modules/json/json.service';
import { JwtTestHelper } from '../helpers/jwt.test.helper';
import { createFakeDocument, createMockExecutionContext } from '../helpers/document.test.helper';

describe('DocumentAuthGuard', () => {
  const testJwtPayload = JwtTestHelper.defaultPayload;
  let documentAuthGuard: DocumentAuthGuard;
  let jsonService: JsonService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DocumentAuthGuard,
        {
          provide: JsonService,
          useValue: {
            any: jest.fn(),
          },
        },
      ],
    }).compile();

    documentAuthGuard = moduleRef.get<DocumentAuthGuard>(DocumentAuthGuard);
    jsonService = moduleRef.get<JsonService>(JsonService);
  });

  it('should return true if user is authenticated and authorized', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, testJwtPayload, document);
    const expectedResult = true;
    jest.spyOn(jsonService, 'any').mockResolvedValue(expectedResult);

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.any).toHaveBeenCalledWith(document.id, document.namespace, testJwtPayload.email);
  });

  it('should return false if user is not authenticated', async () => {
    const context = createMockExecutionContext(false);
    const expectedResult = false;

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.any).not.toHaveBeenCalled();
  });

  it('should return false if user email is missing', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, { ...testJwtPayload, email: null }, document);
    const expectedResult = false;

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.any).not.toHaveBeenCalled();
  });

  it('should return false if the document being edited does not belong to the current user', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, testJwtPayload, document);
    const expectedResult = false;
    jest.spyOn(jsonService, 'any').mockResolvedValue(expectedResult);

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.any).toHaveBeenCalledWith(document.id, document.namespace, testJwtPayload.email);
  });
});
