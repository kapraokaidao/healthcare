import 'dart:async';
import 'dart:math';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:healthcare_app/models/patient.dart';
import 'package:healthcare_app/repositories/authentication_repository.dart';
import 'package:healthcare_app/utils/http_client.dart';
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
      // await _authenticationRepository.logOut();
      yield _mapAuthenticationLogoutRequestedToState(event);
    } else if (event is AuthenticationValidateStatus) {
      yield await _mapValidateStatusToState();
    } else if (event is AuthenticationRegisterRequest) {
      yield await _mapRegisterRequestToState(event);
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

  Future<AuthenticationState> _mapRegisterRequestToState(AuthenticationRegisterRequest event) async {
    final Map<String, dynamic>  userDto = event.user;
    Map<String, dynamic> registerResult = await HttpClient.post('/auth/register', userDto);
    if (registerResult['access_token'] != null) {
      String accessToken = registerResult['access_token'];
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('accessToken', accessToken);
    }
    return state.copyWith(status: AuthenticationStatus.authenticated, step: AuthenticationStep.uploadKYC);
  }

  AuthenticationState _mapNationalIdChangedToState(AuthenticationNationalIdChanged event) {
    final nationalId = event.nationalId;
    return state.copyWith(nationalId: nationalId);
  }

  AuthenticationState _mapPinChangedToState(AuthenticationPinChanged event) {
    final pin = event.pin;
    return state.copyWith(pin: pin);
  }

  Future<AuthenticationState> _mapValidateStatusToState() async {
    String registerStatus = await HttpClient.getWithoutDecode(path: '/patient/register/status');
    User user = await _tryGetUser();
    switch (registerStatus) {
      case "Complete":
        return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.complete);
      case "AwaitApproval":
        return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.awaitApproval);
      case "UploadKYC":
        return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.uploadKYC);
      default:
        return state.copyWith(status: AuthenticationStatus.unauthenticated, user: user, step: AuthenticationStep.login);
    }
  }

  Future<AuthenticationState> _mapCredentialsLoginRequestToState(AuthenticationCredentialsSubmitted event) async {
    String nationalId = state.nationalId;
    String pin = state.pin;
    try {
      Map<String, dynamic> loginResult = await this
          ._authenticationRepository
          .login(nationalId: nationalId, pin: pin);
      print("Login result $loginResult");
      if (loginResult['access_token'] != null) {
        String accessToken = loginResult['access_token'];
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('accessToken', accessToken);
        String registerStatus = await HttpClient.getWithoutDecode(path: '/patient/register/status');
        print("register status $registerStatus");
        User user = await _tryGetUser();
        switch (registerStatus) {
          case "Complete":
            return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.complete);
          case "AwaitApproval":
            return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.awaitApproval);
          case "UploadKYC":
            return state.copyWith(status: AuthenticationStatus.authenticated, user: user, step: AuthenticationStep.uploadKYC);
          default:
            throw ('Invalid register status');
        }
      } else {
        throw ('Unknown login error');
      }
    } catch (e) {
      return state.copyWith(status: AuthenticationStatus.unauthenticated);
    }
    // print(result);
    // print(result['statusCode']);
    // if (result['statusCode'] == 201 && result != null) {
    //   String accessToken = result['access_token'];
    //   SharedPreferences prefs = await SharedPreferences.getInstance();
    //   await prefs.setString('accessToken', accessToken);
    //   User user = await _tryGetUser();
    //   return state.copyWith(status: AuthenticationStatus.authenticated, user: user);
    // }
    // return state.copyWith(status: AuthenticationStatus.unauthenticated);
  }

  AuthenticationState _mapAuthenticationLogoutRequestedToState(AuthenticationLogoutRequested event) {
    _authenticationRepository.logOut();
    return state.copyWith(status: AuthenticationStatus.unauthenticated, user: null);
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
