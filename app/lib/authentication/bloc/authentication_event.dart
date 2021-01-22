part of 'authentication_bloc.dart';

abstract class AuthenticationEvent extends Equatable {
  const AuthenticationEvent();

  @override
  List<Object> get props => [];
}

class AuthenticationStatusChanged extends AuthenticationEvent {
  final AuthenticationStatus status;

  const AuthenticationStatusChanged(this.status);

  @override
  List<Object> get props => [status];
}

class AuthenticationStepChanged extends AuthenticationEvent {
  final AuthenticationStep step;

  const AuthenticationStepChanged(this.step);

  @override
  List<Object> get props => [step];
}

class AuthenticationLogoutRequested extends AuthenticationEvent {}

class AuthenticationNationalIdChanged extends AuthenticationEvent {
  final String nationalId;

  const AuthenticationNationalIdChanged(this.nationalId);

  @override
  List<Object> get props => [nationalId];
}

class AuthenticationPinChanged extends AuthenticationEvent {
  final String pin;

  const AuthenticationPinChanged(this.pin);

  @override
  List<Object> get props => [pin];
}
// class AuthenticationTelNoChanged extends AuthenticationEvent {
//   final String telNo;
//
//   const AuthenticationTelNoChanged(this.telNo);
//
//   @override
//   List<Object> get props => [telNo];
// }
//
// class AuthenticationOTPChanged extends AuthenticationEvent {
//   final String otp;
//
//   const AuthenticationOTPChanged(this.otp);
//
//   @override
//   List<Object> get props => [otp];
// }

class AuthenticationCredentialsSubmitted extends AuthenticationEvent {
  const AuthenticationCredentialsSubmitted();
}

// class AuthenticationOTPRequested extends AuthenticationEvent {
//   const AuthenticationOTPRequested();
// }
//
// class AuthenticationOTPSubmitted extends AuthenticationEvent {
//   const AuthenticationOTPSubmitted();
// }

class AuthenticationPatientProfileUpdated extends AuthenticationEvent {
  final int id;
  final String nationalId;
  final String gender;
  final String birthDate;
  final bool approved;
  final String nationalIdImage;
  final String selfieImage;

  AuthenticationPatientProfileUpdated({
    this.id,
    this.nationalId,
    this.gender,
    this.birthDate,
    this.approved,
    this.nationalIdImage,
    this.selfieImage
  });

  @override
  List<Object> get props => [id, nationalId, birthDate, gender, approved, nationalIdImage, selfieImage];
}