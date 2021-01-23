import 'dart:async';
import 'dart:math';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:healthcare_app/models/patient.dart';
import 'package:meta/meta.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/models/index.dart';

part 'authentication_event.dart';
part 'authentication_state.dart';

class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final AuthenticationRepository _authenticationRepository;
  final UserRepository _userRepository; // FIXME: move auth repo getMyProfile to user repo

  StreamSubscription<AuthenticationStatus> _authenticationStatusSubscription;
  StreamSubscription<AuthenticationStep> _authenticationStepSubscription;

  AuthenticationBloc(
      {@required AuthenticationRepository authenticationRepository,
        @required UserRepository userRepository})
      : assert(authenticationRepository != null),
        assert(userRepository != null),
        _authenticationRepository = authenticationRepository,
        _userRepository = userRepository,
        super(AuthenticationState.unknown()) {
    // Listen for status changed then push the event to BLOCs
    _authenticationStatusSubscription = _authenticationRepository.status.listen(
          (status) => add(AuthenticationStatusChanged(status)),
    );

    // Listen for step changed then push the event to BLOCs
    _authenticationStepSubscription = _authenticationRepository.step
        .listen((step) => add(AuthenticationStepChanged(step)));
  }

  @override
  Stream<AuthenticationState> mapEventToState(
      AuthenticationEvent event,
      ) async* {
    if (event is AuthenticationStatusChanged) {
      yield await _mapAuthenticationStatusChangedToState(event);
    } else if (event is AuthenticationStepChanged) {
      yield await _mapAuthenticationStepChangedToState(event);
    } else if (event is AuthenticationLogoutRequested) {
      _authenticationRepository.logOut();
    // } else if (event is AuthenticationTelNoChanged) {
    //   yield _mapTelNoChangedToState(event, state);
    // } else if (event is AuthenticationOTPChanged) {
    //   yield _mapOTPChangedToState(event, state);
    // } else if (event is AuthenticationOTPRequested) {
    //   yield state.copyWith(status: AuthenticationStatus.authenticating);
      // yield await _mapOTPRequestedToState(event, state);
    // } else if (event is AuthenticationOTPSubmitted) {
    //   yield state.copyWith(status: AuthenticationStatus.authenticating);
      // yield await _mapOTPSubmittedToState(event, state);
    } else if (event is AuthenticationPatientProfileUpdated) {
      yield _mapNewPatientProfileUpdatedToState(event, state);
      // re-work starts here
    } else if (event is AuthenticationNationalIdChanged) {
      yield _mapNationalIdChangedToState(event);
    } else if (event is AuthenticationPinChanged) {
      yield _mapPinChangedToState(event);
    } else if (event is AuthenticationCredentialsSubmitted) {
      yield await _mapCredentialsLoginRequestToState(event);
    }
  }

  @override
  Future<void> close() {
    _authenticationStatusSubscription?.cancel();
    _authenticationStepSubscription?.cancel();
    _authenticationRepository.dispose();
    return super.close();
  }

  Future<AuthenticationState> _mapAuthenticationStatusChangedToState(
      AuthenticationStatusChanged event,
      ) async {
    final status = event.status ?? AuthenticationStatus.unknown;
    switch (status) {
      case AuthenticationStatus.authenticated:
        try {
          User userProfile = await _tryGetUser();
          return state.copyWith(status: AuthenticationStatus.authenticated, user: userProfile);
        } catch(e) {
          return state.copyWith(status: AuthenticationStatus.unauthenticated);
        }
        break;
      default:
        return state.copyWith(status: status);
    }
  }

  Future<AuthenticationState> _mapAuthenticationStepChangedToState(
      AuthenticationStepChanged event) async {
    final step = event.step;

    return state.copyWith(step: step);
  }

  Future<User> _tryGetUser() async {
    try {
      final user = await _authenticationRepository.getMyProfile();
      return user;
    } on Exception {
      return null;
    }
  }

  AuthenticationState _mapNationalIdChangedToState(AuthenticationNationalIdChanged event) {
    final nationalId = event.nationalId;
    return state.copyWith(nationalId: nationalId);
  }

  AuthenticationState _mapPinChangedToState(AuthenticationPinChanged event) {
    final pin = event.pin;
    return state.copyWith(pin: pin);
  }

  Future<AuthenticationState> _mapCredentialsLoginRequestToState(AuthenticationCredentialsSubmitted event) async {
    String nationalId = state.nationalId;
    String pin = state.pin;
    Map<String, dynamic> result = await this
        ._authenticationRepository
        .login(nationalId: nationalId, pin: pin);
    if (result != null) {
      String accessToken = result['access_token'];
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('accessToken', accessToken);
      User user = await _tryGetUser();
      return state.copyWith(status: AuthenticationStatus.authenticated, user: user);
    }
    return state.copyWith(status: AuthenticationStatus.unauthenticated);
  }

  AuthenticationState _mapNewPatientProfileUpdatedToState(AuthenticationPatientProfileUpdated event, AuthenticationState state) {
    Patient current = state?.user?.patient;
    if (current == null) {
      current = Patient();
    }

    return state.copyWith(
        user: state.user.copyWith(
          patient: current.copyWith(
            nationalId: event.nationalId,
            gender: event.gender,
            birthDate: event.birthDate,
            approved: event.approved,
            nationalIdImage: event.nationalIdImage,
            selfieImage: event.selfieImage
          ),
        )
    );
  }
}
