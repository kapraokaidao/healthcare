import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { Keypair } from "../entities/keypair.entity";
import { createKeypairDto } from "./keypair.dto";
import { KeypairService } from "./keypair.service";

@ApiBearerAuth()
@ApiTags("Keypair")
@UseGuards(RolesGuard)
@Controller("keypair")
export class KeypairController {
  constructor(private readonly keypairService: KeypairService) {}

  @Roles(UserRole.Hospital, UserRole.Patient)
  @Post()
  async createKeypair(
    @UserId() userId: number,
    @Body() dto: createKeypairDto
  ): Promise<Keypair> {
    return this.keypairService.createKeypair(userId, dto);
  }

  @Roles(UserRole.Hospital, UserRole.Patient)
  @Get("active")
  async findActiveKeypair(@UserId() userId: number): Promise<Keypair> {
    return this.keypairService.findActiveKeypair(userId);
  }
}
