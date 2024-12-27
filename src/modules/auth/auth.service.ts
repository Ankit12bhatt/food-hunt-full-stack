import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User, UserDetails } from 'src/schema/user.schema';
import { UserAuthDto } from '../../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class AuthService {
  private geocoder;
  //INJECT MODEL
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDetails.name)
    private userDetailsModel: Model<UserDetails>,
    private jwtService: JwtService,
    // private configService: ConfigService,
  ) {
    this.geocoder = NodeGeocoder({
      provider: process.env.GEOCODER_PROVIDER,
      apiKey: process.env.GEOCODER_API_KEY,
    });
  }

  //REGISTER USER
  async register(createUserDto: CreateUserDto): Promise<boolean> {
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (!userExist) {
      const salt = process.env.SALT;
      const hashpassword = await bcrypt.hash(
        createUserDto.password,
        Number(salt),
      );
      const user = await new this.userModel({
        email: createUserDto.email,
        password: hashpassword,
        role: createUserDto.role,
      }).save();
      const geolocation = await this.geocoder.geocode(createUserDto.address);
      await new this.userDetailsModel({
        userCredentialId: user._id,
        businessName: createUserDto.businessName,
        contactNumber: createUserDto.contactNumber,
        address: createUserDto.address,
        location: {
          coordinates: [geolocation[0].latitude, geolocation[0].longitude],
          type: 'Point',
        },
      }).save();
      return true;
    }
    return false;
  }

  // LOGIN USER
  async login(user: UserAuthDto): Promise<object> | null {
    const User = await this.userModel.findOne({ email: user.email });
    if (!User) return null;
    const userDetails = await this.userDetailsModel.findOne({
      userCredentialId: User._id,
    });
    if (!(await bcrypt.compare(user.password, User.password))) return null;
    else {
      // console.log(this.configService.get<string>('SECRET_KEY'));
      const payload = { userId: userDetails._id, role: User.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
        ...payload,
      };
    }
  }
}
