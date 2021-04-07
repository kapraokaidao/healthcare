import { HealthcareToken } from "src/entities/healthcare-token.entity";
import * as dayjs from "dayjs";
import { Patient } from "src/entities/patient.entity";


export function validateBasicRule(patient: Patient, healthcareToken: HealthcareToken): boolean {
    const now = dayjs();
    const userAge = now.diff(patient.birthDate, "year");
    if (!healthcareToken.isActive) {
      return false;
    }
    if (healthcareToken.startAge && healthcareToken.startAge > userAge) {
      return false;
    }
    if (healthcareToken.endAge && healthcareToken.endAge < userAge) {
      return false;
    }
    if (healthcareToken.gender && healthcareToken.gender != patient.gender) {
      return false;
    }
    if (healthcareToken.startDate && now.isBefore(healthcareToken.startDate, "day")) {
      return false;
    }
    if (healthcareToken.endDate && now.isAfter(healthcareToken.endDate, "day")) {
      return false;
    }
    return true;
  }