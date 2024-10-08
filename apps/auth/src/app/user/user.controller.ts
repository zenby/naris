import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpJsonResult, HttpJsonStatus, UserRole } from '@soer/sr-common-interfaces';
import { responseErrorSchema } from '../auth/doc/response-error.schema';
import { responseSchema } from '../auth/doc/response.schema';
import { Roles } from '../common/decorators/roles.decorator';
import { RefreshCookieGuard } from '../common/guards/refreshCookie.guard';
import { RolesGuard } from '../common/guards/roles-guard';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BlockUserOptions } from './dto/block-user-options';
import { User } from '../common/decorators/user.decorator';
import { UserInfoDto } from './dto/user-info-dto';
import { UserOwnerGuard } from '../common/guards/user-owner.guard';

@UseGuards(RefreshCookieGuard, UserOwnerGuard, RolesGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(UserController.name);
  private internalErrorMessage = 'Something went wrong. Try it later';

  @Roles(UserRole.ADMIN)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'get users from db',
    description: 'Requesting user should be an Admin. Returns list os users from database',
  })
  @ApiFoundResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseSchema })
  @ApiUnauthorizedResponse({ description: 'Should be an admin.' })
  @Get('users')
  async getUsers(): Promise<HttpJsonResult<UserEntity | string>> {
    try {
      const users = await this.userService.getUsers();
      if (users instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [users.message] };
      }

      return { status: HttpJsonStatus.Ok, items: users };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Roles(UserRole.ADMIN)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'delete user from db',
    description: "Requires the user's id whitch will be deleted. Returns status of the operation",
  })
  @ApiOkResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseErrorSchema('User with id ${id} not found') })
  @ApiUnauthorizedResponse({ description: 'Should be an admin.' })
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number): Promise<HttpJsonResult<string>> {
    try {
      const result = await this.userService.deleteUser(id);
      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Roles(UserRole.ADMIN)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'block or unblock user from db',
    description: "Requires the user's id which will be blocked. Returns status of the operation",
  })
  @ApiOkResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseErrorSchema('User with id ${id} not found') })
  @ApiUnauthorizedResponse({ description: 'Should be an admin.' })
  @Put('user/:id')
  async changeBlockStatus(@Param('id') id: number, @Body() options: BlockUserOptions): Promise<HttpJsonResult<string>> {
    try {
      const result = await this.userService.changeBlockStatus(id, options.isBlocked);

      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'updates user profile info',
    description: "Requires the user's id and userInfoDto. Returns status of the operation",
  })
  @ApiOkResponse({ schema: responseSchema })
  @Put('user/:uuid/profile')
  async updateUserProfile(
    @Param('uuid') uuid: string,
    @User() user: UserEntity,
    @Body() userInfoDto: UserInfoDto
  ): Promise<HttpJsonResult<string>> {
    try {
      const result = await this.userService.updateUserInfo(uuid, userInfoDto);
      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
