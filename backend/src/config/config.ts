
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  serviceEmail: "hugo.deslongchamps@gmail.com",
  emailPassword: "",
  patientEmail: "hugo.deslongchamps@gmail.com",
  doctorEmail: "hugo.deslongchamps@gmail.com",
}));