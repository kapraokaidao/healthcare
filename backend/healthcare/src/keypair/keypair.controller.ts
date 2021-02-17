import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { ChangePinDto, CreateKeypairDto, IsActiveResponseDto } from "./keypair.dto";
import { KeypairService } from "./keypair.service";

@ApiBearerAuth()
@ApiTags("Keypair")
@UseGuards(RolesGuard)
@Controller("keypair")
export class KeypairController {
  constructor(private readonly keypairService: KeypairService) {}

  @Roles(UserRole.HospitalAdmin, UserRole.Hospital, UserRole.Patient)
  @Post()
  async createKeypair(
    @UserId() userId: number,
    @Body() dto: CreateKeypairDto
  ): Promise<void> {
    return this.keypairService.createKeypair(userId, dto.pin);
  }

  @Roles(UserRole.HospitalAdmin)
  @Put("change")
  async changePin(@UserId() userId: number, @Body() dto: ChangePinDto): Promise<void> {
    return this.keypairService.changePin(userId, dto.currentPin, dto.newPin);
  }

  @Roles(UserRole.HospitalAdmin, UserRole.Patient, UserRole.Hospital)
  @Get("is-active")
  async findActiveKeypair(@UserId() userId: number): Promise<IsActiveResponseDto> {
    return this.keypairService.isActive(userId);
  }
}
