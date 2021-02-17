import { Patient } from "../entities/patient.entity";
import { User } from "../entities/user.entity";

export const getUserObject = (patient: Patient): User => {
  // receive: patient with key user
  // return : user with key patient
  if (!patient.user) {
    throw new Error("Patient object not containing user object");
  }
  const user = patient.user;
  delete patient.user;
  user["patient"] = patient;
  return user;
};
