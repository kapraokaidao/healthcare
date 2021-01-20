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

class AuthenticationTelNoChanged extends AuthenticationEvent {
  final String telNo;

  const AuthenticationTelNoChanged(this.telNo);

  @override
  List<Object> get props => [telNo];
}

class AuthenticationOTPChanged extends AuthenticationEvent {
  final String otp;

  const AuthenticationOTPChanged(this.otp);

  @override
  List<Object> get props => [otp];
}

class AuthenticationOTPRequested extends AuthenticationEvent {
  const AuthenticationOTPRequested();
}

class AuthenticationOTPSubmitted extends AuthenticationEvent {
  const AuthenticationOTPSubmitted();
}

class AuthenticationPatientProfileUpdated extends AuthenticationEvent {
  final String name;
  final String birthDate;
  final String gender;

  AuthenticationPatientProfileUpdated({ this.name, this.birthDate, this.gender });

  @override
  List<Object> get props => [name, birthDate, gender];
}