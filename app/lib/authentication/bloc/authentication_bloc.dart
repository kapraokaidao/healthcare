import 'dart:async';

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
    } else if (event is AuthenticationTelNoChanged) {
      yield _mapTelNoChangedToState(event, state);
    } else if (event is AuthenticationOTPChanged) {
      yield _mapOTPChangedToState(event, state);
    } else if (event is AuthenticationOTPRequested) {
      yield state.copyWith(status: AuthenticationStatus.authenticating);
      // yield await _mapOTPRequestedToState(event, state);
    } else if (event is AuthenticationOTPSubmitted) {
      yield state.copyWith(status: AuthenticationStatus.authenticating);
      // yield await _mapOTPSubmittedToState(event, state);
    } else if (event is AuthenticationPatientProfileUpdated) {
      yield _mapNewPatientProfileUpdatedToState(event, state);
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

  AuthenticationState _mapTelNoChangedToState(
      AuthenticationTelNoChanged event, AuthenticationState state) {
    final telNo = event.telNo;

    return state.copyWith(telNo: telNo);
  }

  AuthenticationState _mapOTPChangedToState(
      AuthenticationOTPChanged event, AuthenticationState state) {
    final otp = event.otp;

    return state.copyWith(otp: otp);
  }

  // Future<AuthenticationState> _mapOTPRequestedToState(
  //     AuthenticationOTPRequested event, AuthenticationState state) async {
  //   String telNo = state.telNo;
  //   telNo = telNo.replaceFirst(new RegExp(r'0'), '+66');
  //
  //   Map<String, dynamic> result =
  //   await this._authenticationRepository.requestOTP(telNo: telNo);
  //
  //   if (result != null && result['status'] == 'success') {
  //     return state.copyWith(
  //         ref: result['ref'], step: AuthenticationStep.inputOTP, status: AuthenticationStatus.unknown);
  //   }
  //   return state.copyWith(status: AuthenticationStatus.unauthenticated);
  // }

  // Future<AuthenticationState> _mapOTPSubmittedToState(
  //     AuthenticationOTPSubmitted event, AuthenticationState state) async {
  //   if (state.otp.length >= 6) {
  //     FirebaseMessaging firebaseMessaging = FirebaseMessaging();
  //     String deviceToken = await firebaseMessaging.getToken();
  //
  //     String telNo = state.telNo;
  //     telNo = telNo.replaceFirst(new RegExp(r'0'), '+66');
  //
  //     Map<String, dynamic> result = await this
  //         ._authenticationRepository
  //         .submitOTP(otp: state.otp, ref: state.ref, telNo: telNo, deviceToken: deviceToken);
  //
  //     if (result != null && result['status'] == 'success') {
  //       String accessToken = result['access_token'];
  //       SharedPreferences prefs = await SharedPreferences.getInstance();
  //       await prefs.setString('accessToken', accessToken);
  //
  //       User userProfile = await _tryGetUser();
  //       return state.copyWith(status: AuthenticationStatus.authenticated, user: userProfile);
  //     }
  //   }
  //   return state.copyWith(status: AuthenticationStatus.unauthenticated);
  // }

  AuthenticationState _mapNewPatientProfileUpdatedToState(AuthenticationPatientProfileUpdated event, AuthenticationState state) {
    Patient current = state?.user?.patient;
    if (current == null) {
      current = Patient();
    }

    return state.copyWith(
        user: state.user.copyWith(
          patient: current.copyWith(
            name: event.name,
            birthDate: event.birthDate,
            gender: event.gender,
          ),
        )
    );
  }
}
