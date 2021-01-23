import 'dart:async';
import 'package:healthcare_app/models/user.dart';
import 'package:meta/meta.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AuthenticationStatus {
  unknown,
  authenticating,
  authenticated,
  unauthenticated
}
enum AuthenticationStep { unknown, inputCredential }

class AuthenticationRepository {
  final _statusController = StreamController<AuthenticationStatus>();
  final _stepController = StreamController<AuthenticationStep>();

  Stream<AuthenticationStatus> get status async* {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String token = prefs.getString('accessToken');
    // String token = null;

    if (token != null) {
      yield AuthenticationStatus.authenticated;
    } else {
      yield AuthenticationStatus.unauthenticated;
    }

    yield* _statusController.stream;
  }

  Stream<AuthenticationStep> get step async* {
    yield AuthenticationStep.unknown;
    yield* _stepController.stream;
  }

  Future<User> getMyProfile() async {
    Map<String, dynamic> response = await HttpClient.get(path: '/user/me');
    if (response != null) {
      return User.fromJSON(response);
    }
    return null;
  }

  Future<dynamic> login(
      {
        @required String nationalId,
        @required String pin}) async {
    Map<String, dynamic> response = await HttpClient.post(
        '/auth/login', {'username': nationalId, 'password': pin});
    return response;
  }

  void logOut() {
    _statusController.add(AuthenticationStatus.unauthenticated);
  }

  void dispose() {
    _statusController.close();
    _stepController.close();
  }
}
