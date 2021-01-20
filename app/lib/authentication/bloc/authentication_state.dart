part of 'authentication_bloc.dart';

class AuthenticationState extends Equatable {
  final AuthenticationStatus status;
  final AuthenticationStep step;
  final User user;
  final String otp;
  final String ref;
  final String telNo;

  const AuthenticationState(
      {this.otp = '',
        this.ref = '',
        this.telNo = '',
        this.user,
        this.status = AuthenticationStatus.unknown,
        this.step = AuthenticationStep.inputCredential});

  const AuthenticationState.unknown()
      : this(status: AuthenticationStatus.unknown);

  const AuthenticationState.authenticated()
      : this(status: AuthenticationStatus.authenticated);

  const AuthenticationState.unauthenticated()
      : this(status: AuthenticationStatus.unauthenticated);

  AuthenticationState copyWith(
      {String otp,
        String ref,
        String telNo,
        User user,
        AuthenticationStep step,
        AuthenticationStatus status}) {
    return AuthenticationState(
        otp: otp ?? this.otp,
        ref: ref ?? this.ref,
        telNo: telNo ?? this.telNo,
        status: status ?? this.status,
        user: user ?? this.user,
        step: step ?? this.step);
  }

  @override
  List<Object> get props => [status, user, otp, ref, telNo, step];
}
