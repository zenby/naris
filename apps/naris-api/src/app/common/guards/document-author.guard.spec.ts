import { Test } from '@nestjs/testing';
import { DocumentAuthorGuard } from './document-author.guard';
import { JsonService } from '../../modules/json/json.service';
import { JwtTestHelper } from '../helpers/jwt.test.helper';
import { createFakeDocument, createMockExecutionContext } from '../helpers/document.test.helper';

describe('DocumentAuthorGuard', () => {
  const testJwtPayload = JwtTestHelper.defaultPayload;
  let documentAuthGuard: DocumentAuthorGuard;
  let jsonService: JsonService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DocumentAuthorGuard,
        {
          provide: JsonService,
          useValue: {
            isUserAuthorOfDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    documentAuthGuard = moduleRef.get<DocumentAuthorGuard>(DocumentAuthorGuard);
    jsonService = moduleRef.get<JsonService>(JsonService);
  });

  it('should return true if user is authenticated and authorized', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, testJwtPayload, document);
    const expectedResult = true;
    jest.spyOn(jsonService, 'isUserAuthorOfDocument').mockResolvedValue(expectedResult);

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.isUserAuthorOfDocument).toHaveBeenCalledWith(document.id, testJwtPayload.email);
  });

  it('should return false if user is not authenticated', async () => {
    const context = createMockExecutionContext(false);
    const expectedResult = false;

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.isUserAuthorOfDocument).not.toHaveBeenCalled();
  });

  it('should return false if user email is missing', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, { ...testJwtPayload, email: null }, document);
    const expectedResult = false;

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.isUserAuthorOfDocument).not.toHaveBeenCalled();
  });

  it('should return false if the document being edited does not belong to the current user', async () => {
    const document = createFakeDocument();
    const context = createMockExecutionContext(true, testJwtPayload, document);
    const expectedResult = false;
    jest.spyOn(jsonService, 'isUserAuthorOfDocument').mockResolvedValue(expectedResult);

    const result = await documentAuthGuard.canActivate(context);

    expect(result).toBe(expectedResult);
    expect(jsonService.isUserAuthorOfDocument).toHaveBeenCalledWith(document.id, testJwtPayload.email);
  });
});
