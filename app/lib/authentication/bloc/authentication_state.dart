part of 'authentication_bloc.dart';

class AuthenticationState extends Equatable {
  final AuthenticationStatus status;
  final AuthenticationStep step;
  final User user;
  final String nationalId;
  final String pin;

  const AuthenticationState(
      {
        this.nationalId = '',
        this.pin = '',
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
      {
        String nationalId,
        String pin,
        User user,
        AuthenticationStep step,
        AuthenticationStatus status
      }) {
    return AuthenticationState(
        nationalId: nationalId ?? this.nationalId,
        pin: pin ?? this.pin,
        status: status ?? this.status,
        user: user ?? this.user,
        step: step ?? this.step);
  }

  @override
  List<Object> get props => [status, user, step, nationalId, pin];
}
