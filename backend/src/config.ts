import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  serviceEmail: "hugo.deslongchamps@gmail.com",
  emailPassword: "",
  patientEmail: "hugo@hugodes.com",
  doctorEmail: "hugo@hugodes.com",
}));
